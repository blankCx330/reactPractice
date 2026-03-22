# AI 智能点评功能规划文档

> **创建日期**：2026-03-20
>
> **项目定位**：双非冲大厂的「王炸加分项」
>
> **预计工时**：2-3 小时
>
> **面试价值**：⭐⭐⭐⭐⭐（极高）

---

## 一、功能概述

### 1.1 功能定位

用户查询城市天气后，点击「AI 智能点评」按钮，系统基于当前天气数据，通过大模型 API 流式生成个性化的天气点评和建议。

**核心价值**：

- 将项目从「80分优秀」提升到「95分亮眼」
- 打造差异化竞争力，突破双非学历筛选
- 展示 AIGC 应用能力，紧跟大厂前端技术趋势

### 1.2 功能流程

```
用户查看天气详情
    ↓
点击「AI 智能点评」按钮
    ↓
显示 Loading 状态
    ↓
SSE 流式输出文字（打字机效果）
    ↓
输出完成，可重新生成
```

### 1.3 生成内容

AI 将基于以下数据生成点评：

| 数据类型   | 字段        | 示例       |
| ---------- | ----------- | ---------- |
| 城市名称   | city        | 北京市     |
| 天气状况   | weather     | 晴         |
| 当前温度   | temperature | 25°C       |
| 体感温度   | feelsLike   | 26°C       |
| 湿度       | humidity    | 45%        |
| 风向风力   | wind        | 东南风 3级 |
| 空气质量   | airQuality  | 优         |
| 紫外线指数 | uvIndex     | 3          |

**生成内容包含**：

- 今日穿衣建议
- 出行建议
- 运动/户外活动建议
- 温馨提示（防晒、保暖、防雨等）
- 天气趋势分析（如有7日数据）

---

## 二、技术方案

### 2.1 技术选型

| 技术     | 选择                        | 理由                               |
| -------- | --------------------------- | ---------------------------------- |
| AI 服务  | DeepSeek API                | 成本低、响应快、国产大模型访问稳定 |
| 流式传输 | SSE (Server-Sent Events)    | 前端 AI 标配技术，打字机效果       |
| 状态管理 | React useState + useReducer | 简单场景无需引入额外状态库         |
| 数据请求 | fetch API                   | SSE 需要原生 fetch 处理流          |

### 2.2 为什么选择 DeepSeek

| 对比项   | DeepSeek     | OpenAI       | 通义千问     |
| -------- | ------------ | ------------ | ------------ |
| 成本     | ¥1/百万token | $5/百万token | ¥2/百万token |
| 国内访问 | ✅ 稳定      | ❌ 需代理    | ✅ 稳定      |
| 响应速度 | 快           | 中等         | 快           |
| 流式支持 | ✅ 完整      | ✅ 完整      | ✅ 完整      |

**结论**：DeepSeek 性价比最高，适合个人项目

### 2.3 技术方案对比：流式 vs 非流式

> **重要说明**：这是面试高频考点，务必理解透彻

#### 两种实现方案

**方案 A：React Query `useMutation`（非流式）**

```tsx
import { useMutation } from '@tanstack/react-query'

const { mutate, isLoading, data } = useMutation({
  mutationFn: async (weatherData) => {
    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        stream: false  // ❌ 非流式
      }),
    })
    return res.json()  // 等待完整响应
  },
})

// 使用
<button onClick={() => mutate(weatherData)}>
  {isLoading ? '生成中...' : 'AI 智能点评'}
</button>
{data && <div>{data.choices[0].message.content}</div>}
```

**方案 B：原生 `fetch` + `ReadableStream`（流式）**

```tsx
const [content, setContent] = useState('')
const [isLoading, setIsLoading] = useState(false)

const generateComment = async () => {
  setIsLoading(true)
  setContent('')

  const res = await fetch(url, {
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [...],
      stream: true  // ✅ 流式
    }),
  })

  const reader = res.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const delta = parseSSE(chunk)  // 解析 SSE 数据
    setContent(prev => prev + delta)  // 增量更新
  }

  setIsLoading(false)
}

// 使用：打字机效果
<div>{content}{isLoading && <span>|</span>}</div>
```

#### 用户体验对比

| 对比项       | 方案 A（非流式）    | 方案 B（流式）           |
| ------------ | ------------------- | ------------------------ |
| 首次看到内容 | 等待 3-5 秒完整响应 | **200ms 内出现第一个字** |
| 用户感受     | "卡住了吗？"        | "AI 正在思考"            |
| 视觉效果     | 一次性全部显示      | **打字机效果**           |
| 可中断性     | 无法中断            | 可随时停止               |
| 实现复杂度   | 简单                | 中等                     |
| 面试价值     | ⭐⭐                | ⭐⭐⭐⭐⭐               |

**行业数据**：

- 非流式：用户盯着空白屏幕等待 5-15 秒
- 流式：首次 token 约 200ms，文字逐字流动
- **流式是 AI 应用的 UX 标配**（ChatGPT、Claude 都用流式）

#### 为什么 `useMutation` 不支持流式？

| 问题                                     | 原因                                    |
| ---------------------------------------- | --------------------------------------- |
| `data` 在 `isLoading` 期间是 `undefined` | React Query 设计为等待完整响应          |
| `queryFn` 只能 return 一次               | 无法持续推送增量数据                    |
| 没有增量更新机制                         | 需要手动调用 `setQueryData`，反而更复杂 |

**结论**：`useMutation` 适用于 CRUD 操作，但**不支持流式输出的增量 UI 更新**。

#### 最终选择：方案 B（流式）

| 理由         | 说明                                      |
| ------------ | ----------------------------------------- |
| **用户体验** | 打字机效果是 AI 应用的标配                |
| **面试价值** | SSE 流式处理是前端 AI 交互的核心技术点    |
| **技术深度** | 展示对 ReadableStream、TextDecoder 的理解 |
| **差异化**   | 大部分简历项目没有流式 AI 功能            |

---

### 2.4 架构设计

```
┌─────────────────────────────────────────────────────────┐
│                      UI 层                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │              AIComment.tsx                       │   │
│  │  - 渲染按钮、Loading、内容区域                   │   │
│  │  - 调用 useAIStream Hook                        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                     Hook 层                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │              useAIStream.ts                      │   │
│  │  - 管理流式内容状态 (content, isLoading, error) │   │
│  │  - 处理 SSE 数据解析                            │   │
│  │  - 提供 generateComment 方法                    │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    服务层                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │              aiService.ts                        │   │
│  │  - 封装 DeepSeek API 调用                       │   │
│  │  - 构建 Prompt 模板                             │   │
│  │  - 处理请求配置                                 │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  外部 API                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │         DeepSeek Chat API                        │   │
│  │         POST /v1/chat/completions               │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 三、文件结构

### 3.1 新增文件

```
src/
├── services/
│   └── aiService.ts          # AI 服务封装
├── hooks/
│   └── useAIStream.ts        # SSE 流式处理 Hook
├── components/
│   └── AIComment.tsx         # AI 点评 UI 组件
└── types/
    └── ai.ts                 # AI 相关类型定义
```

### 3.2 修改文件

| 文件                                        | 修改内容                     |
| ------------------------------------------- | ---------------------------- |
| `.env`                                      | 添加 `VITE_DEEPSEEK_API_KEY` |
| `LeftContainer.tsx` 或 `RightContainer.tsx` | 引入 AIComment 组件          |

---

## 四、详细实现指南

### 4.1 步骤一：环境变量配置

**文件**：`.env`

```env
# 和风天气 API
VITE_QWEATHER_API_KEY=your_qweather_key
VITE_API_HOST=devapi.qweather.com

# DeepSeek API（新增）
VITE_DEEPSEEK_API_KEY=your_deepseek_key
```

**获取 API Key**：

1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/)
2. 注册账号并完成实名认证
3. 在「API Keys」页面创建新密钥

### 4.2 步骤二：类型定义

**文件**：`src/types/ai.ts`

```typescript
/**
 * AI 智能点评相关类型定义
 */

/**
 * AI 点评请求参数
 */
export interface AICommentRequest {
  /** 城市名称 */
  city: string
  /** 天气状况描述 */
  weather: string
  /** 当前温度 */
  temperature: string
  /** 体感温度 */
  feelsLike?: string
  /** 相对湿度 */
  humidity: string
  /** 风向风力 */
  wind: string
  /** 空气质量等级 */
  airQuality?: string
  /** 紫外线指数 */
  uvIndex?: string
  /** 日期 */
  fxDate?: string
}

/**
 * AI 点评响应状态
 */
export interface AICommentState {
  /** 生成的文本内容 */
  content: string
  /** 是否正在加载 */
  isLoading: boolean
  /** 错误信息 */
  error: string | null
}

/**
 * DeepSeek API 非流式响应格式
 */
export interface DeepSeekResponse {
  id: string
  object: string
  created: number
  model: string
  choices: DeepSeekChoice[]
}

export interface DeepSeekChoice {
  index: number
  message: {
    role: string
    content: string
  }
  finish_reason: string | null
}

/**
 * DeepSeek API 流式响应格式（SSE）
 * 每一行 data: 后面是一个这样的 JSON 对象
 */
export interface DeepSeekSseResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    delta: {
      role?: string
      content?: string
    }
    finish_reason: string | null
  }>
}

/**
 * AI 点评 Hook 返回类型
 */
export interface UseAICommentReturn {
  /** 流式拼接的点评文本 */
  commentText: string
  /** 是否正在加载 */
  isLoading: boolean
  /** 是否出错 */
  isError: boolean
  /** 重新请求方法 */
  refetch: () => void
  /** 重置状态方法 */
  reset: () => void
}
  index: number
  delta: {
    content?: string
    role?: string
  }
  finish_reason: string | null
}
```

### 4.3 步骤三：AI 服务封装

**文件**：`src/services/aiService.ts`

```typescript
import type { AICommentRequest } from '../types/ai'

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

/**
 * 构建 AI 点评的 Prompt
 */
function buildPrompt(params: AICommentRequest): string {
  const { city, weather, temperature, feelsLike, humidity, wind, airQuality, uvIndex } = params

  return `${city}今日天气情况：
- 天气状况：${weather}
- 当前温度：${temperature}°C
${feelsLike ? `- 体感温度：${feelsLike}°C` : ''}
- 相对湿度：${humidity}%
- 风向风力：${wind}
${airQuality ? `- 空气质量：${airQuality}` : ''}
${uvIndex ? `- 紫外线指数：${uvIndex}` : ''}

请作为专业的天气分析师，给出以下建议（简洁明了，每项2-3句话）：
1. 穿衣建议
2. 出行建议
3. 运动/户外活动建议
4. 温馨提示

请直接输出建议内容，不要有开场白。`
}

/**
 * 调用 DeepSeek API 获取 AI 点评
 * @param params 天气参数
 * @returns Response 对象（用于 SSE 流式读取）
 */
export async function fetchAIComment(params: AICommentRequest): Promise<Response> {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY

  if (!apiKey) {
    throw new Error('DeepSeek API Key 未配置，请在 .env 文件中设置 VITE_DEEPSEEK_API_KEY')
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content:
            '你是一位专业的天气分析师，擅长根据天气数据给出实用的生活建议。你的回答简洁、专业、有温度。',
        },
        {
          role: 'user',
          content: buildPrompt(params),
        },
      ],
      stream: true, // 启用流式输出
      temperature: 0.7,
      max_tokens: 500,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || `API 请求失败: ${response.status}`)
  }

  return response
}
```

### 4.4 步骤四：SSE 流式处理 Hook

**文件**：`src/hooks/useAIStream.ts`

> **⚠️ 为什么不用 React Query 的 `useMutation`？**
>
> 这是面试高频考点！豆包等 AI 给出的方案常有以下错误：
>
> ````tsx
> // ❌ 错误用法（豆包方案）
> const { isLoading, data } = useQuery({
>   queryFn: async () => {
>     // SSE 流式读取...
>     // 问题：queryFn 只能 return 一次，无法持续推送增量数据
>   },
>   enabled: false,
>   cacheTime: 5 * 60 * 1000, // 无意义，因为返回 void
> // });
> //
> // // ❌ 错误的清理方式
> // useState(() => {
> //   return () => { /* 清理函数永远不会执行！*/ }
> // }, [])
> // ```
>
> **问题总结**：
> | 问题 | 后果 |
> |------|------|
> // | `useState()` 用作清理函数 | 清理函数从未执行，**内存泄漏** |
> // | `queryFn` 返回 `Promise<void>` | React Query 缓存无意义，data 永远是 void |
> // | `cacheTime`/`staleTime` 对流式数据无效 | 流式数据存 useState，缓存配置完全无效 |
> //
> // **正确做法**：用原生 `fetch` + `useState` + `useEffect` 管理流式输出。
> ````

```typescript
import { useState, useCallback, useRef, useEffect } from 'react'
import { fetchAIComment } from '../services/aiService'
import type { AICommentRequest } from '../types/ai'

/**
 * AI 流式输出 Hook
 * 处理 SSE (Server-Sent Events) 流式数据
 */
export function useAIStream() {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 用于取消请求的 AbortController
  const abortControllerRef = useRef<AbortController | null>(null)

  /**
   * 组件卸载时取消请求，防止内存泄漏
   */
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  /**
   * 生成 AI 点评
   */
  const generateComment = useCallback(async (params: AICommentRequest) => {
    // 取消之前的请求
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    setIsLoading(true)
    setError(null)
    setContent('')

    try {
      const response = await fetchAIComment(params)
      const reader = response.body?.getReader()

      if (!reader) {
        throw new Error('无法获取响应流')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (!signal.aborted) {
        const { done, value } = await reader.read()

        if (done) break

        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()

            if (data === '[DONE]') continue

            try {
              const json = JSON.parse(data)
              const delta = json.choices?.[0]?.delta?.content || ''

              if (delta) {
                setContent(prev => prev + delta)
              }
            } catch {
              // 忽略 JSON 解析错误
            }
          }
        }
      }
    } catch (err) {
      // 忽略取消错误
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      setError(err instanceof Error ? err.message : '生成失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * 取消当前请求
   */
  const cancel = useCallback(() => {
    abortControllerRef.current?.abort()
    setIsLoading(false)
  }, [])

  /**
   * 清空内容
   */
  const clearContent = useCallback(() => {
    setContent('')
    setError(null)
  }, [])

  return {
    content,
    isLoading,
    error,
    generateComment,
    cancel,
    clearContent,
  }
}
```

**关键点解析**：

| 要点                        | 说明                             | 面试价值   |
| --------------------------- | -------------------------------- | ---------- |
| `useRef` 存 AbortController | 避免重渲染丢失引用               | ⭐⭐⭐⭐   |
| `useEffect` 清理函数        | 组件卸载时取消请求，防止内存泄漏 | ⭐⭐⭐⭐⭐ |
| `signal.aborted` 检查       | 循环中检测取消状态               | ⭐⭐⭐⭐   |
| 忽略 `AbortError`           | 取消是预期行为，不应显示错误     | ⭐⭐⭐     |
| `buffer` 处理跨 chunk 数据  | SSE 数据可能跨多个 chunk         | ⭐⭐⭐⭐   |

### 4.5 步骤五：UI 组件

**文件**：`src/components/AIComment.tsx`

```tsx
import { useAIStream } from '../hooks/useAIStream'
import type { WeatherNow } from '../types/qweather'
import type { AICommentRequest } from '../types/ai'

interface AICommentProps {
  /** 城市名称 */
  city: string
  /** 实时天气数据 */
  weatherNow: WeatherNow
  /** 空气质量等级（可选） */
  airQuality?: string
  /** 紫外线指数（可选） */
  uvIndex?: string
}

export default function AIComment({ city, weatherNow, airQuality, uvIndex }: AICommentProps) {
  const { content, isLoading, error, generateComment, clearContent } = useAIStream()

  const handleGenerate = () => {
    const params: AICommentRequest = {
      city,
      weather: weatherNow.text,
      temperature: weatherNow.temp,
      feelsLike: weatherNow.feelsLike,
      humidity: weatherNow.humidity,
      wind: `${weatherNow.windDir} ${weatherNow.windScale}级`,
      airQuality,
      uvIndex,
    }

    generateComment(params)
  }

  return (
    <div className="ai-comment-container">
      {/* 按钮 */}
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="ai-comment-btn"
        aria-label="获取AI智能点评"
      >
        {isLoading ? (
          <>
            <span className="loading-spinner"></span>
            生成中...
          </>
        ) : (
          '🤖 AI 智能点评'
        )}
      </button>

      {/* 错误提示 */}
      {error && (
        <div className="ai-comment-error">
          <span>❌ {error}</span>
          <button onClick={handleGenerate} className="retry-btn">
            重试
          </button>
        </div>
      )}

      {/* 内容区域 */}
      {content && (
        <div className="ai-comment-content">
          <div className="ai-comment-header">
            <span>📋 AI 点评</span>
            <button onClick={clearContent} className="clear-btn" aria-label="清空">
              ✕
            </button>
          </div>
          <div className="ai-comment-text">
            {content}
            {isLoading && <span className="cursor-blink">|</span>}
          </div>
          {!isLoading && (
            <button onClick={handleGenerate} className="regenerate-btn">
              🔄 重新生成
            </button>
          )}
        </div>
      )}
    </div>
  )
}
```

### 4.6 步骤六：样式文件

**文件**：`src/css/AIComment.css`

```css
/* AI 点评容器 */
.ai-comment-container {
  margin-top: 1rem;
  padding: 1rem;
}

/* 主按钮 */
.ai-comment-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ai-comment-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.ai-comment-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Loading 动画 */
.loading-spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 错误提示 */
.ai-comment-error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  background: #fee2e2;
  border-radius: 0.5rem;
  color: #dc2626;
}

.retry-btn {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  color: #dc2626;
  background: transparent;
  border: 1px solid #dc2626;
  border-radius: 0.25rem;
  cursor: pointer;
}

/* 内容区域 */
.ai-comment-content {
  margin-top: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 暗色主题 */
.dark .ai-comment-content {
  background: rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.1);
}

.ai-comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: inherit;
}

.clear-btn {
  padding: 0.25rem 0.5rem;
  background: transparent;
  border: none;
  color: inherit;
  opacity: 0.6;
  cursor: pointer;
  font-size: 1rem;
}

.clear-btn:hover {
  opacity: 1;
}

/* 文本内容 */
.ai-comment-text {
  line-height: 1.8;
  white-space: pre-wrap;
  color: inherit;
}

/* 光标闪烁动画 */
.cursor-blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

/* 重新生成按钮 */
.regenerate-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: inherit;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.regenerate-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
```

### 4.7 步骤七：集成到页面

**方案 A：在 LeftContainer 中集成（推荐）**

修改 `src/components/LeftContainer.tsx`：

```tsx
import TodaySWeather from './TodaySWeather'
import SevenDayWeather from './SevenDayWeather'
import ErrorBoundary from './ErrorBoundary'
import AIComment from './AIComment' // 新增
import '../css/LeftContainer.css'
import '../css/AIComment.css' // 新增

export default function LeftContainer() {
  return (
    <div className="left-container">
      <ErrorBoundary>
        <TodaySWeather />
      </ErrorBoundary>
      <ErrorBoundary>
        <SevenDayWeather />
      </ErrorBoundary>
      {/* AI 点评组件需要从父组件或 Store 获取天气数据 */}
    </div>
  )
}
```

**方案 B：在 TodaySWeather 中集成**

在天气详情卡片底部添加 AI 点评按钮，需要传入当前城市名称和天气数据。

---

## 五、数据流设计

### 5.1 数据来源

AI 点评组件需要以下数据：

| 数据       | 来源                     | 获取方式                             |
| ---------- | ------------------------ | ------------------------------------ |
| 城市名称   | useCityData Hook         | `nowCityData?.location?.[0]?.name`   |
| 实时天气   | useWeatherNowData Hook   | `useWeather?.now`                    |
| 空气质量   | useAirQuality Hook       | `airQuality?.indexes?.[0]?.category` |
| 紫外线指数 | useWeatherDailyData Hook | `sevenWeather?.daily?.[0]?.uvIndex`  |

### 5.2 数据传递方案

**推荐方案**：使用 Zustand Store 共享数据

```typescript
// 在 useLocationStore 或新建 useWeatherDataStore 中存储天气数据
// AIComment 组件直接从 Store 读取
```

**备选方案**：通过 Props 传递

```tsx
// WeatherApp.tsx
<LeftContainer
  weatherNow={useWeather?.now}
  city={nowCityData?.location?.[0]?.name}
  airQuality={airQuality}
/>
```

---

## 六、安全考量

### 6.1 API Key 安全

**问题**：前端直接调用 AI API 会暴露 API Key

**解决方案**：

| 方案                  | 适用场景            | 实现复杂度 |
| --------------------- | ------------------- | ---------- |
| 环境变量 + .gitignore | 个人项目、演示项目  | 低 ✅      |
| 后端代理              | 生产环境、多人使用  | 中         |
| Serverless Function   | Vercel/Netlify 部署 | 中         |

**推荐做法**：

1. `.env` 文件添加到 `.gitignore`
2. 简历项目演示时使用个人测试 Key
3. 如部署上线，使用 Vercel Edge Functions 代理

### 6.2 敏感信息处理

```typescript
// ❌ 不要在前端打印 API Key
console.log(import.meta.env.VITE_DEEPSEEK_API_KEY)

// ✅ 只检查是否存在
if (!import.meta.env.VITE_DEEPSEEK_API_KEY) {
  throw new Error('API Key 未配置')
}
```

---

## 七、错误处理

### 7.1 错误类型

| 错误类型       | 处理方式     | 用户提示                   |
| -------------- | ------------ | -------------------------- |
| API Key 未配置 | 抛出错误     | "服务未配置，请联系管理员" |
| 网络错误       | catch 捕获   | "网络异常，请检查网络连接" |
| API 限流       | 检测状态码   | "请求过于频繁，请稍后再试" |
| 内容生成失败   | SSE 解析错误 | "生成失败，请重新尝试"     |

### 7.2 降级策略

```typescript
// 当 AI 服务不可用时，显示静态建议
const fallbackTips = {
  sunny: '天气晴朗，适合户外活动',
  rainy: '今日有雨，出门请带伞',
  cloudy: '天气多云，气温适宜',
  // ...
}

if (error) {
  return <StaticTip weather={weatherNow.text} tips={fallbackTips} />
}
```

---

## 八、面试亮点提炼

### 8.1 技术点总结

| 技术点           | 面试价值   | 可讲内容                     |
| ---------------- | ---------- | ---------------------------- |
| **AI API 集成**  | ⭐⭐⭐⭐⭐ | 大厂前端都在做 AI 赋能业务   |
| **SSE 流式输出** | ⭐⭐⭐⭐⭐ | 前端 AI 交互标配技术         |
| **异步状态管理** | ⭐⭐⭐⭐   | Loading、Error、流式内容状态 |
| **API 安全**     | ⭐⭐⭐⭐   | 环境变量、后端代理方案       |
| **用户体验优化** | ⭐⭐⭐⭐   | 打字机效果、错误恢复         |

### 8.2 简历写法

```
集成 DeepSeek 大模型 API，实现气象数据 AI 智能点评；
基于 SSE 实现文本流式渲染，提升用户交互体验；
封装安全的 API 请求策略，适配前端 AI 交互场景。
```

### 8.3 面试问答准备

**Q1: 为什么选择 SSE 而不是 WebSocket？**

A: SSE 是单向通信，服务器向客户端推送数据，正好符合 AI 流式输出的场景。相比 WebSocket：

- 实现更简单，基于 HTTP 协议
- 自动重连机制
- 更适合单向数据流场景

**Q2: 前端调用 AI API 的安全问题怎么解决？**

A: 个人演示项目使用环境变量 + .gitignore。生产环境建议：

1. 使用后端代理，API Key 存储在服务端
2. 使用 Serverless Function（如 Vercel Edge Functions）
3. 添加请求频率限制

**Q3: 流式输出的数据如何处理？**

A: 使用 Fetch API 的 ReadableStream + Reader：

1. 通过 `response.body.getReader()` 获取 reader
2. 循环调用 `reader.read()` 读取数据块
3. 使用 TextDecoder 解码
4. 按 SSE 格式解析 `data:` 前缀的 JSON 数据
5. 提取 `delta.content` 并追加到状态中

**Q4: 为什么不用 React Query 的 useMutation 来发请求？**

A: `useMutation` 不支持流式输出的增量 UI 更新，原因：

| 问题                                     | 说明                                     |
| ---------------------------------------- | ---------------------------------------- |
| `data` 在 `isLoading` 期间是 `undefined` | 用户看不到生成中的内容                   |
| `queryFn` 只能 return 一次               | 无法持续推送增量数据                     |
| 没有增量更新机制                         | 要用 `setQueryData` 手动更新，反而更复杂 |

**如果强行用 useMutation 实现流式，需要这样写**：

```tsx
const { mutate, data, isLoading } = useMutation({
  mutationFn: async params => {
    const res = await fetch(url, { stream: true })
    const reader = res.body.getReader()
    queryClient.setQueryData(['ai'], '') // 初始化

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      // 手动更新缓存
      queryClient.setQueryData(['ai'], prev => prev + delta)
    }
    return queryClient.getQueryData(['ai'])
  },
})
```

**但这反而比直接用 useState 更复杂**，而且没有流式 UI 效果。

**正确做法**：用原生 `fetch` + `useState` 处理流式输出，简单直接。

**Q5: 我看到有人用 `useState()` 返回清理函数，这正确吗？**

A: **❌ 这是严重错误！** 只有 `useEffect` 支持返回清理函数。

```tsx
// ❌ 错误：清理函数永远不会执行
useState(() => {
  return () => {
    sseRef.current?.close() // 永远不会调用！
  }
}, [])

// ✅ 正确：useEffect 清理函数
useEffect(() => {
  return () => {
    sseRef.current?.close() // 组件卸载时调用
  }
}, [])
```

**后果**：内存泄漏，组件卸载后 SSE 连接不会关闭。

**Q6: 如何防止用户快速点击多次触发多个请求？**

A: 使用 AbortController + 状态检查：

```tsx
const generateComment = useCallback(async (params) => {
  // 取消之前的请求
  abortControllerRef.current?.abort()
  abortControllerRef.current = new AbortController()

  // 或者在按钮上禁用
  if (isLoading) return
  // ... 继续请求
}, [isLoading])

// UI 层也可以禁用按钮
<button onClick={generateComment} disabled={isLoading}>
  {isLoading ? '生成中...' : 'AI 点评'}
</button>
```

---

## 九、测试验收

### 9.1 功能测试

| 测试项   | 预期结果          | 通过标准                   |
| -------- | ----------------- | -------------------------- |
| 点击按钮 | 显示 Loading 状态 | ✅ 按钮文字变为"生成中..." |
| 流式输出 | 文字逐字显示      | ✅ 打字机效果流畅          |
| 内容生成 | 包含穿衣/出行建议 | ✅ 内容完整有意义          |
| 错误处理 | 显示错误提示      | ✅ 有重试按钮              |
| 重新生成 | 清空后重新输出    | ✅ 可多次生成              |

### 9.2 边界测试

| 场景         | 处理方式             |
| ------------ | -------------------- |
| 无网络连接   | 显示"网络异常"错误   |
| API Key 错误 | 显示"服务未配置"     |
| 请求超时     | 设置 timeout 并提示  |
| 快速多次点击 | 按钮禁用防止重复请求 |

### 9.3 验收命令

```bash
# 1. 类型检查
npm run build

# 2. Lint 检查
npm run lint

# 3. 启动开发服务器测试
npm run dev
```

---

## 十、扩展方向

### 10.1 功能扩展

| 扩展功能 | 描述               | 优先级 |
| -------- | ------------------ | ------ |
| 历史记录 | 保存最近生成的点评 | P2     |
| 多语言   | 支持中英文切换     | P3     |
| 语音播报 | TTS 朗读点评内容   | P3     |
| 分享功能 | 分享点评到社交平台 | P2     |

### 10.2 性能优化

| 优化项   | 方案                     |
| -------- | ------------------------ |
| 请求防抖 | 防止用户快速多次点击     |
| 响应缓存 | 相同天气条件使用缓存结果 |
| 取消请求 | 支持中断正在进行的请求   |

---

## 十一、参考资源

### 官方文档

| 资源                       | 链接                                                                |
| -------------------------- | ------------------------------------------------------------------- |
| DeepSeek API 文档          | https://platform.deepseek.com/docs                                  |
| SSE MDN 文档               | https://developer.mozilla.org/zh-CN/docs/Web/API/Server-sent_events |
| Fetch API - ReadableStream | https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream     |

### 相关技术文章

- [前端实现流式输出的三种方案](https://juejin.cn/post/7269958242828632120)
- [DeepSeek API 接入指南](https://platform.deepseek.com/api-docs/zh-cn/)

---

## 十二、实施清单

### Day 1（1-2小时）

- [ ] 获取 DeepSeek API Key
- [ ] 创建 `src/types/ai.ts` 类型定义
- [ ] 创建 `src/services/aiService.ts` 服务封装
- [ ] 创建 `src/hooks/useAIStream.ts` Hook

### Day 2（1小时）

- [ ] 创建 `src/components/AIComment.tsx` UI 组件
- [ ] 创建 `src/css/AIComment.css` 样式文件
- [ ] 修改 `.env` 添加 API Key
- [ ] 集成到页面中

### Day 3（30分钟）

- [ ] 功能测试
- [ ] 样式调优
- [ ] 错误处理完善
- [ ] 更新简历描述

---

**文档版本**：v1.0
**创建日期**：2026-03-20
**维护者**：项目开发者
