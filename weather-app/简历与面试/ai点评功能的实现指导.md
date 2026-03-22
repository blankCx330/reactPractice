# AI 点评功能实现指导

> **目标**：理解代码原理，面试时能清晰讲解
>
> **适用场景**：自己学习 + 面试准备
>
> **创建日期**：2026-03-20

---

## 📚 一、快速上手学习路径

### 学习顺序（建议 3-4 小时）

| 阶段 | 内容                     | 时间  | 学习资源            |
| ---- | ------------------------ | ----- | ------------------- |
| 1    | 理解 SSE 基本概念        | 30min | MDN Web Docs        |
| 2    | ReadableStream API       | 30min | MDN Streams API     |
| 3    | AbortController 请求取消 | 20min | MDN AbortController |
| 4    | 阅读本文档代码解析       | 60min | 本文档              |
| 5    | 自己手写一遍代码         | 60min | 不看文档实现        |

### 核心知识点清单

```
必须掌握（面试必问）：
├── SSE (Server-Sent Events) 原理
├── ReadableStream + Reader 流式读取
├── AbortController 请求取消
├── React Hooks (useState, useRef, useEffect, useCallback)
└── 为什么不用 React Query

了解即可：
├── TextDecoder 二进制解码
├── DeepSeek API 响应格式
└── Prompt Engineering 基础
```

---

## 🔍 二、整体架构一览

```
用户点击按钮
    │
    ▼
┌─────────────────────────────────────────┐
│  AIComment.tsx (UI 组件)                │
│  - 渲染按钮、内容区域                    │
│  - 调用 generateComment()               │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  useAIStream.ts (Hook)                  │
│  - 管理 content, isLoading, error 状态  │
│  - 处理 SSE 流式数据                    │
│  - 提供 cancel() 取消方法               │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  aiService.ts (API 封装)                │
│  - 构建 Prompt                          │
│  - 发送 fetch 请求                      │
│  - 返回 Response 对象                   │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  DeepSeek API (外部服务)                │
│  - 返回 SSE 流式数据                    │
└─────────────────────────────────────────┘
```

---

## 📖 三、核心代码逐行解析

### 3.1 API 服务层解析

```typescript
// ============ 文件：src/services/aiService.ts ============

import type { AICommentRequest } from '../types/ai'

// DeepSeek API 地址（OpenAI 兼容格式）
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

/**
 * 构建 AI 点评的 Prompt
 *
 * 【为什么要单独抽这个函数？】
 * 1. 单一职责：Prompt 构建逻辑与请求逻辑分离
 * 2. 方便测试：可以单独测试 Prompt 生成是否正确
 * 3. 方便修改：调整 Prompt 格式时只改这一个地方
 */
function buildPrompt(params: AICommentRequest): string {
  // 解构参数，让代码更清晰
  const { city, weather, temperature, feelsLike, humidity, wind, airQuality, uvIndex } = params

  // 模板字符串构建 Prompt
  // 【注意】可选字段用三元表达式处理，避免出现 "undefined" 字符串
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
 *
 * 【为什么返回 Response 而不是解析后的数据？】
 * 因为要支持流式读取，Response.body 是 ReadableStream，
 * 需要在 Hook 中逐步读取，不能在这里一次性读完。
 *
 * 如果是非流式请求，可以在这里解析完再返回。
 */
export async function fetchAIComment(params: AICommentRequest): Promise<Response> {
  // 从环境变量获取 API Key
  // 【重要】永远不要硬编码 API Key，这是安全问题！
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY

  // 防御性编程：提前检查 API Key 是否存在
  // 【面试点】体现你对异常情况的处理意识
  if (!apiKey) {
    throw new Error('DeepSeek API Key 未配置，请在 .env 文件中设置 VITE_DEEPSEEK_API_KEY')
  }

  // 发送 POST 请求
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Bearer Token 认证方式，这是 HTTP 标准
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      // messages 是对话历史，model 会根据这个生成回复
      // system: 设定 AI 的角色和行为规范
      // user: 用户的实际问题
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
      // ⭐ 关键配置：启用流式输出
      // stream: true 表示响应会分块返回，而不是等全部生成完再返回
      stream: true,
      // temperature 控制输出的随机性（0-2）
      // 0.7 是一个平衡点：既不太死板，也不会太随机
      temperature: 0.7,
      // max_tokens 限制输出的最大 token 数
      // 防止 AI 生成过长内容，控制 API 调用成本
      max_tokens: 500,
    }),
  })

  // 错误处理：HTTP 状态码非 2xx
  // 【注意】.catch(() => ({})) 防止 response.json() 也失败时报错
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || `API 请求失败: ${response.status}`)
  }

  // 返回原始 Response，让 Hook 去处理流式读取
  return response
}
```

---

### 3.2 SSE 流式处理 Hook 解析（核心）

```typescript
// ============ 文件：src/hooks/useAIStream.ts ============

import { useState, useCallback, useRef, useEffect } from 'react'
import { fetchAIComment } from '../services/aiService'
import type { AICommentRequest } from '../types/ai'

/**
 * AI 流式输出 Hook
 *
 * 【为什么用 Hook 而不是直接在组件里写？】
 * 1. 复用性：多个组件可以使用同一个逻辑
 * 2. 关注点分离：UI 组件只负责渲染，逻辑在 Hook 里
 * 3. 测试方便：可以单独测试 Hook 的逻辑
 */
export function useAIStream() {
  // ============ 状态定义 ============

  // 流式拼接的文本内容
  const [content, setContent] = useState('')

  // 加载状态
  const [isLoading, setIsLoading] = useState(false)

  // 错误信息
  const [error, setError] = useState<string | null>(null)

  // ============ Ref 定义 ============

  /**
   * AbortController 引用
   *
   * 【为什么用 useRef 而不是 useState？】
   *
   * 这是一个反直觉的点！
   *
   * ❌ 错误理解：ref 和 state 都是存数据，没什么区别
   *
   * ✅ 正确理解：
   * - useState 的值变化会触发组件重渲染
   * - useRef 的值变化不会触发重渲染
   *
   * AbortController 只是一个"工具对象"，我们不需要它的变化触发 UI 更新。
   * 我们只需要在一个稳定的引用中保存它，方便随时取消请求。
   *
   * 【面试回答范例】
   * "useRef 用于存储不需要触发重渲染的值，比如 DOM 引用、定时器 ID、
   * AbortController 等。如果用 useState，每次创建新的 controller 都会
   * 触发不必要的重渲染，影响性能。"
   */
  const abortControllerRef = useRef<AbortController | null>(null)

  // ============ 副作用：清理 ============

  /**
   * 组件卸载时取消请求
   *
   * 【为什么这很重要？】
   *
   * 想象这个场景：
   * 1. 用户点击"AI 点评"，请求发出，正在等待响应
   * 2. 用户突然跳转到其他页面
   * 3. 组件被卸载，但请求还在继续
   * 4. 响应回来了，尝试调用 setContent 更新状态
   * 5. 💥 报错！因为组件已经卸载，状态不存在了
   *
   * 这就是"内存泄漏"的一种形式，虽然 React 19 不会真的报错，
   * 但会在控制台警告，面试官会认为你工程能力不足。
   *
   * 【面试回答范例】
   * "我会在 useEffect 的清理函数中取消未完成的请求，
   * 防止组件卸载后还尝试更新状态，这是 React 的最佳实践。"
   */
  useEffect(() => {
    return () => {
      // 组件卸载时，取消正在进行的请求
      abortControllerRef.current?.abort()
    }
  }, []) // 空依赖数组，只在组件挂载/卸载时执行

  // ============ 核心方法：生成点评 ============

  /**
   * 生成 AI 点评
   *
   * 【为什么用 useCallback 包裹？】
   *
   * useCallback 会返回一个"稳定引用"的函数。
   *
   * 如果不用 useCallback：
   * - 每次组件渲染，generateComment 都是一个新函数
   * - 如果这个函数被传给子组件，子组件会不必要地重渲染
   *
   * 用了 useCallback：
   * - 只有依赖项变化时，才会创建新函数
   * - 性能更好，也符合 React 最佳实践
   *
   * 但在这个例子中，generateComment 不会传给子组件，
   * 所以 useCallback 的收益不大。但作为学习范例，
   * 展示最佳实践是有意义的。
   */
  const generateComment = useCallback(async (params: AICommentRequest) => {
    // ============ 第一步：准备工作 ============

    // 取消之前的请求
    /**
     * 【为什么要取消之前的请求？】
     *
     * 想象用户快速点击两次"生成"按钮：
     * - 第一次请求发出，正在等待响应
     * - 用户又点了一次
     * - 第二次请求发出
     * - 现在有两个请求在并行进行
     * - 两个响应都会回来，都会调用 setContent
     * - 结果：内容混乱，可能两个回复混在一起
     *
     * 解决方案：在发起新请求前，先取消之前的请求
     */
    abortControllerRef.current?.abort()

    // 创建新的 AbortController
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    // 重置状态
    setIsLoading(true)
    setError(null)
    setContent('') // 清空之前的内容

    // ============ 第二步：发送请求 ============

    try {
      // 调用 API 服务，获取 Response
      const response = await fetchAIComment(params)

      /**
       * 获取 ReadableStream 的 Reader
       *
       * 【反直觉点：response.body 是什么？】
       *
       * 普通的 fetch 请求：
       * const data = await response.json() // 等待完整响应
       *
       * 流式请求：
       * const reader = response.body.getReader() // 立即返回，慢慢读
       *
       * response.body 是一个 ReadableStream 对象，
       * 它代表一个"正在流动的数据流"，你可以一点点读取。
       *
       * 【类比】
       * - 普通 fetch：等快递全部到货，一次性拆箱
       * - 流式 fetch：快递送到一件拆一件
       */
      const reader = response.body?.getReader()

      if (!reader) {
        throw new Error('无法获取响应流')
      }

      // TextDecoder 用于将二进制数据解码为字符串
      /**
       * 【为什么要解码？】
       *
       * HTTP 响应的 body 是二进制数据（Uint8Array），
       * 不是直接的字符串。需要用 TextDecoder 转换。
       *
       * 【类比】
       * - 原始数据：一堆 0 和 1
       * - TextDecoder：翻译官，把 0 和 1 翻译成文字
       */
      const decoder = new TextDecoder()

      /**
       * buffer 用于处理跨 chunk 的数据
       *
       * 【这是一个重要的边界情况！】
       *
       * SSE 数据格式是按行分割的：
       * data: {"choices":[{"delta":{"content":"今天"}}]}
       * data: {"choices":[{"delta":{"content":"天气"}}]}
       *
       * 但是，一个 chunk 可能包含不完整的行：
       * chunk 1: "data: {\"choices\":[{\"delta\":{\"content\":\"今"
       * chunk 2: "天\"}}]}\n\ndata: ..."
       *
       * 如果直接按行分割，第一行的 JSON 是不完整的，解析会失败。
       *
       * 解决方案：
       * 1. 把当前 chunk 加到 buffer 末尾
       * 2. 按换行符分割
       * 3. 最后一个不完整的行放回 buffer
       * 4. 下一个 chunk 来时继续拼接
       */
      let buffer = ''

      // ============ 第三步：循环读取流 ============

      /**
       * 流式读取循环
       *
       * 【为什么用 while 而不是递归？】
       *
       * while 更直观，也避免了递归可能导致的栈溢出。
       *
       * 【signal.aborted 是什么？】
       *
       * AbortController.signal.aborted 是一个布尔值，
       * 表示请求是否已被取消。
       *
       * 当调用 abort() 时，signal.aborted 变为 true。
       * 我们在循环中检查这个值，如果已取消就退出循环。
       */
      while (!signal.aborted) {
        // 读取下一个数据块
        /**
         * reader.read() 返回一个 Promise，resolve 为：
         * { done: boolean, value: Uint8Array | undefined }
         *
         * - done: true 表示流已结束
         * - value: 当前块的数据（二进制）
         */
        const { done, value } = await reader.read()

        if (done) break // 流结束，退出循环

        // 解码二进制数据
        // { stream: true } 表示这是流的一部分，解码器会处理跨块字符
        buffer += decoder.decode(value, { stream: true })

        // 按换行符分割
        const lines = buffer.split('\n')

        // 最后一个元素可能是不完整的行，放回 buffer
        buffer = lines.pop() || ''

        // ============ 第四步：解析 SSE 数据 ============

        // 遍历每一行
        for (const line of lines) {
          // SSE 数据格式：以 "data: " 开头
          /**
           * SSE (Server-Sent Events) 数据格式：
           *
           * data: {"choices":[{"delta":{"content":"今天"}}]}
           * data: {"choices":[{"delta":{"content":"天气"}}]}
           * data: [DONE]
           *
           * 每一行以 "data: " 开头，后面是 JSON 数据。
           * "[DONE]" 表示流结束。
           */
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim() // 去掉 "data: " 前缀

            // [DONE] 是流结束标记
            if (data === '[DONE]') continue

            try {
              // 解析 JSON
              const json = JSON.parse(data)

              // 提取增量内容
              /**
               * DeepSeek/OpenAI 流式响应结构：
               * {
               *   choices: [{
               *     delta: { content: "新增的文字" },
               *     finish_reason: null | "stop"
               *   }]
               * }
               *
               * delta 表示"增量"，每次只返回新增的部分。
               */
              const delta = json.choices?.[0]?.delta?.content || ''

              if (delta) {
                /**
                 * 【为什么用函数式更新？】
                 *
                 * setContent(prev => prev + delta)
                 *
                 * 而不是：
                 * setContent(content + delta)
                 *
                 * 这是因为 content 是闭包捕获的值，可能不是最新的。
                 *
                 * 【场景】
                 * 1. 第一次 delta = "今"，setContent 触发
                 * 2. 还没重渲染，第二次 delta = "天"
                 * 3. 此时 content 还是 ""，不是 "今"
                 * 4. 如果用 content + delta，结果是 "天" 而不是 "今天"
                 *
                 * 函数式更新确保每次都基于最新状态。
                 */
                setContent(prev => prev + delta)
              }
            } catch {
              // 忽略 JSON 解析错误（可能是不完整的数据）
              // 这在流式场景中很常见，不是真正的错误
            }
          }
        }
      }
    } catch (err) {
      // ============ 错误处理 ============

      /**
       * 【为什么要检查 AbortError？】
       *
       * 当调用 abort() 取消请求时，fetch 会抛出一个错误：
       * { name: 'AbortError', message: 'The operation was aborted.' }
       *
       * 这是预期的行为，不是真正的错误，不应该显示给用户。
       *
       * 【面试回答范例】
       * "取消请求会触发 AbortError，这是预期行为。
       * 我会检查错误类型，如果是 AbortError 就静默处理，
       * 其他错误才显示给用户。"
       */
      if (err instanceof Error && err.name === 'AbortError') {
        return // 静默处理取消错误
      }

      setError(err instanceof Error ? err.message : '生成失败，请稍后重试')
    } finally {
      // 无论成功还是失败，都结束加载状态
      setIsLoading(false)
    }
  }, []) // 空依赖数组，函数引用稳定

  // ============ 辅助方法 ============

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

  // ============ 返回值 ============

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

---

### 3.3 UI 组件解析

```typescript
// ============ 文件：src/components/AIComment.tsx ============

import { useAIStream } from '../hooks/useAIStream'
import type { WeatherNow } from '../types/qweather'
import type { AICommentRequest } from '../types/ai'

interface AICommentProps {
  city: string
  weatherNow: WeatherNow
  airQuality?: string
  uvIndex?: string
}

export default function AIComment({ city, weatherNow, airQuality, uvIndex }: AICommentProps) {
  // 调用 Hook 获取状态和方法
  const { content, isLoading, error, generateComment, clearContent } = useAIStream()

  // 构建请求参数
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
      {/* 主按钮 */}
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="ai-comment-btn"
        aria-label="获取AI智能点评"
      >
        {isLoading ? (
          <>
            {/* Loading 动画 */}
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

          {/* 流式文本 + 打字机光标效果 */}
          <div className="ai-comment-text">
            {content}
            {/*
              【打字机光标效果】
              isLoading 时显示闪烁的 | 符号，
              让用户知道 AI 正在生成内容。
              这是一个小细节，但大大提升用户体验。
            */}
            {isLoading && <span className="cursor-blink">|</span>}
          </div>

          {/* 重新生成按钮 */}
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

---

## ⚠️ 四、反直觉问题深度解析

### 4.1 为什么不用 React Query？

**直觉想法**：

> "项目里已经用了 React Query，为什么 AI 请求不用它？"

**真实原因**：

React Query 的设计目标是处理**一次性请求-响应**模式：

```
请求 → 等待 → 完整响应 → 缓存
```

但 SSE 流式输出是**持续推送**模式：

```
请求 → 立即返回流 → 持续读取数据块 → 增量更新 UI
```

**关键冲突**：

| React Query                      | SSE 流式                        |
| -------------------------------- | ------------------------------- |
| `queryFn` 只能 return 一次       | 需要多次更新 UI                 |
| `data` 在 loading 时是 undefined | 需要在 loading 时显示已生成内容 |
| 缓存最终结果                     | 每次生成都不同，缓存无意义      |

**如果强行用 React Query**：

```typescript
// ❌ 问题方案
const { data, isLoading } = useMutation({
  mutationFn: async () => {
    // 这里只能 return 最终结果
    // 无法在过程中更新 UI
    return finalResult
  },
})
// isLoading 时 data 是 undefined，用户看不到生成中的内容
```

**正确方案**：

```typescript
// ✅ 使用 useState 直接管理流式状态
const [content, setContent] = useState('')
// 每次 delta 来了就更新，用户能实时看到
setContent(prev => prev + delta)
```

---

### 4.2 useRef vs useState 的选择

**直觉想法**：

> "都是存数据，有什么区别？"

**真实区别**：

```typescript
// useState：值变化触发重渲染
const [count, setCount] = useState(0)
setCount(1) // 触发重渲染，UI 会更新

// useRef：值变化不触发重渲染
const countRef = useRef(0)
countRef.current = 1 // 不触发重渲染，UI 不会更新
```

**选择原则**：

| 用 useState                     | 用 useRef                                    |
| ------------------------------- | -------------------------------------------- |
| 需要 UI 显示的值                | 不需要 UI 显示的值                           |
| 值变化要触发更新                | 只是个"容器"                                 |
| 比如：content, isLoading, error | 比如：AbortController, 定时器 ID, 上一次的值 |

**AbortController 为什么用 ref？**

```typescript
// ❌ 如果用 state
const [controller, setController] = useState(null)
setController(new AbortController()) // 每次都触发重渲染，浪费性能

// ✅ 用 ref
const controllerRef = useRef(null)
controllerRef.current = new AbortController() // 不触发重渲染，性能更好
```

---

### 4.3 清理函数为什么放在 useEffect 里？

**直觉想法**：

> "直接在组件里写 return () => {} 不行吗？"

**错误示例**（豆包的错误）：

```typescript
// ❌ 错误：useState 不支持返回清理函数
useState(() => {
  return () => {
    // 这个函数永远不会执行！
    sseRef.current?.close()
  }
}, [])
```

**正确写法**：

```typescript
// ✅ 只有 useEffect 支持清理函数
useEffect(() => {
  return () => {
    // 组件卸载时执行
    abortControllerRef.current?.abort()
  }
}, [])
```

**原因**：

- `useState(initialValue)` 的 initialValue 可以是函数，但它是**初始化函数**，返回值作为初始状态
- `useEffect(setup)` 的 setup 函数可以返回一个**清理函数**，在组件卸载或依赖变化时执行

这是 React Hooks 的设计规范，违反会导致功能失效。

---

### 4.4 buffer 处理跨 chunk 数据

**直觉想法**：

> "直接按行分割不就行了？"

**问题场景**：

```
chunk 1: "data: {\"content\":\"你"
chunk 2: "好\"}\n\ndata: {\"content\":\"吗\"}"
```

如果直接处理 chunk 1：

- `line = "data: {\"content\":\"你"`
- JSON.parse 会失败，因为不完整

**正确处理**：

```typescript
let buffer = ''

while (true) {
  buffer += decoder.decode(value, { stream: true })

  const lines = buffer.split('\n')
  buffer = lines.pop() || '' // 不完整的行放回 buffer

  for (const line of lines) {
    // 处理完整的行
  }
}
```

这样：

- chunk 1 后：buffer = `"data: {\"content\":\"你"`（不完整，等待下一个 chunk）
- chunk 2 后：buffer = `"data: {\"content\":\"你好\"}\n\ndata: {\"content\":\"吗\"}"`
- 按 `\n` 分割后，得到完整的行

---

## 🎯 五、面试必问问题准备

### Q1: 什么是 SSE？为什么用 SSE 而不是 WebSocket？

**回答**：

SSE (Server-Sent Events) 是一种服务器向客户端单向推送数据的技术。

**选择 SSE 的原因**：

| 对比项     | SSE                      | WebSocket      |
| ---------- | ------------------------ | -------------- |
| 通信方向   | 单向（服务器→客户端）    | 双向           |
| 协议       | HTTP                     | WebSocket 协议 |
| 实现复杂度 | 简单                     | 复杂           |
| 适用场景   | 服务器推送（如 AI 生成） | 实时聊天、游戏 |

AI 点评是典型的**服务器单向推送**场景，SSE 更轻量、更简单。

---

### Q2: 流式输出的原理是什么？

**回答**：

1. **请求端**：`fetch` 设置 `stream: true`，API 返回流式响应
2. **响应端**：`response.body` 是 ReadableStream，可以逐步读取
3. **处理端**：用 `reader.read()` 循环读取数据块，TextDecoder 解码
4. **渲染端**：每次增量更新 React 状态，触发 UI 重渲染

**关键代码**：

```typescript
const reader = response.body.getReader()
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  const chunk = decoder.decode(value)
  setContent(prev => prev + parseChunk(chunk))
}
```

---

### Q3: 如何防止内存泄漏？

**回答**：

1. **使用 AbortController 取消请求**：

   ```typescript
   const controller = new AbortController()
   // 发请求时传入 signal
   fetch(url, { signal: controller.signal })
   // 取消时
   controller.abort()
   ```

2. **在 useEffect 清理函数中取消**：

   ```typescript
   useEffect(() => {
     return () => {
       abortControllerRef.current?.abort()
     }
   }, [])
   ```

3. **组件卸载时，所有进行中的请求都会被取消，不会尝试更新已卸载组件的状态**。

---

### Q4: 你的实现中有什么亮点？

**回答**：

1. **AbortController 请求取消**：防止快速点击产生多个请求，防止内存泄漏
2. **buffer 处理跨 chunk 数据**：处理 SSE 数据边界问题，更健壮
3. **函数式状态更新**：`setContent(prev => prev + delta)` 确保基于最新状态
4. **打字机光标效果**：小细节提升用户体验
5. **错误边界处理**：静默处理 AbortError，友好显示其他错误

---

## 📝 六、自己动手练习

### 练习 1：实现基础版本

**目标**：不看文档，实现一个能工作的 AI 点评功能

**步骤**：

1. 创建 `useAIStream` Hook，只实现 `content` 和 `isLoading` 状态
2. 创建 `AIComment` 组件，只有按钮和内容显示
3. 不需要取消功能、错误处理

### 练习 2：添加取消功能

**目标**：在练习 1 基础上，添加 AbortController

**步骤**：

1. 添加 `abortControllerRef`
2. 在 `useEffect` 清理函数中取消
3. 处理 AbortError

### 练习 3：处理边界情况

**目标**：添加 buffer 处理、错误处理、重试功能

**步骤**：

1. 添加 buffer 变量处理跨 chunk 数据
2. 添加 `error` 状态和重试按钮
3. 添加 `clearContent` 方法

---

## 📚 七、扩展学习资源

### 必读文档

| 主题               | 链接                                                                |
| ------------------ | ------------------------------------------------------------------- |
| Streams API        | https://developer.mozilla.org/zh-CN/docs/Web/API/Streams_API        |
| ReadableStream     | https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream     |
| AbortController    | https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController    |
| Server-Sent Events | https://developer.mozilla.org/zh-CN/docs/Web/API/Server-sent_events |

### 推荐阅读

1. **React 官方文档**：Hooks 部分（useState, useRef, useEffect, useCallback）
2. **DeepSeek API 文档**：https://platform.deepseek.com/docs
3. **OpenAI Streaming 文档**：流式响应的处理方式

---

**文档版本**：v1.0
**创建日期**：2026-03-20
**适用场景**：自己学习 + 面试准备
