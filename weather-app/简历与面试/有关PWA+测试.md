# PWA + Vitest 测试指南

> **创建时间**：2026-03-22
>
> **适用项目**：天气咨询 React 项目
>
> **目标**：理解 PWA 和 Vitest 的概念、实现方式、以及两者在工程化中的关系

---

## 📖 目录

1. [什么是 PWA？](#一什么是-pwa)
2. [什么是 Vitest 测试？](#二什么是-vitest-测试)
3. [如何在项目中实现 PWA](#三如何在项目中实现-pwa)
4. [如何在项目中实现 Vitest 测试](#四如何在项目中实现-vitest-测试)
5. [PWA 与测试的关系](#五pwa-与测试的关系)
6. [为什么进度报告把它们放在一起？](#六为什么进度报告把它们放在一起)
7. [面试要点总结](#七面试要点总结)

---

## 一、什么是 PWA？

### 1.1 PWA 定义

**PWA（Progressive Web App）渐进式 Web 应用** 是一种结合了 Web 应用和原生应用优势的技术方案。

简单理解：**让网页像 App 一样运行**，可以安装到桌面、离线使用、发送通知。

### 1.2 PWA 核心特性

| 特性         | 说明                | 用户价值                     |
| ------------ | ------------------- | ---------------------------- |
| **可安装**   | 添加到手机/电脑桌面 | 像原生 App 一样启动          |
| **离线可用** | 无网络时也能访问    | 地铁、电梯等弱网场景         |
| **后台同步** | 网络恢复后自动同步  | 断网提交表单，联网后自动发送 |
| **推送通知** | 接收服务器推送消息  | 消息提醒、活动通知           |
| **快速加载** | 缓存策略优化首屏    | 秒开体验                     |

### 1.3 PWA 技术组成

```
PWA 技术栈：
├── Service Worker    # 核心：拦截请求、缓存资源、离线处理
├── Web App Manifest  # 配置：应用名称、图标、启动画面
├── HTTPS            # 安全：Service Worker 必须在 HTTPS 下运行
└── Cache API        # 存储：缓存静态资源和 API 响应
```

### 1.4 Service Worker 工作原理

```
用户访问网页
    ↓
浏览器注册 Service Worker
    ↓
Service Worker 安装 → 缓存静态资源
    ↓
Service Worker 激活 → 拦截网络请求
    ↓
┌─────────────────────────────────────┐
│  用户请求资源                         │
│      ↓                              │
│  Service Worker 拦截                 │
│      ↓                              │
│  ┌─────────────┐                    │
│  │ 有缓存？     │                    │
│  └─────────────┘                    │
│      ↓          ↓                   │
│   [是]        [否]                  │
│      ↓          ↓                   │
│  返回缓存    网络请求 → 缓存 → 返回   │
└─────────────────────────────────────┘
```

### 1.5 天气咨询项目中的 PWA 价值

| 场景               | 没有 PWA          | 有 PWA                    |
| ------------------ | ----------------- | ------------------------- |
| 用户在地铁上查天气 | ❌ 加载失败       | ✅ 显示缓存的天气数据     |
| 用户想快速打开应用 | 🔍 浏览器输入网址 | 📱 桌面图标一键打开       |
| 用户断网后恢复     | 需要手动刷新      | 自动同步最新数据          |
| 面试展示           | 无亮点            | 工程化意识 + 用户体验意识 |

---

## 二、什么是 Vitest 测试？

### 2.1 Vitest 定义

**Vitest** 是一个专为 Vite 项目设计的下一代测试框架，由 Vue 团队开发。

简单理解：**自动检测代码是否按预期工作的工具**。

### 2.2 为什么选择 Vitest？

| 对比项     | Jest             | Vitest                 |
| ---------- | ---------------- | ---------------------- |
| Vite 兼容  | 需要额外配置     | 开箱即用               |
| 启动速度   | 较慢（需要编译） | 极快（复用 Vite 编译） |
| HMR 热更新 | ❌ 不支持        | ✅ 支持                |
| ESM 支持   | 需要配置         | 原生支持               |
| TypeScript | 需要配置         | 开箱即用               |
| 学习成本   | 中等             | 低（API 兼容 Jest）    |

### 2.3 测试类型

```
测试金字塔：
                    ┌─────────┐
                    │  E2E    │  端到端测试（用户视角）
                    │  测试   │  - 模拟真实用户操作
                    ├─────────┤  - 覆盖完整流程
                    │  集成   │  集成测试（模块协作）
                    │  测试   │  - 多个模块协同工作
                    ├─────────┤  - API 调用测试
               ┌────┴─────────┴────┐
               │    单元测试       │  单元测试（最小单元）
               │                   │  - 测试单个函数/组件
               │                   │  - 速度快、数量多
               └───────────────────┘
```

### 2.4 测试示例

```tsx
// 示例：测试 Zustand Store
import { describe, it, expect, beforeEach } from 'vitest'
import { useFavoritesCityStore } from './useFavoritesCityStore'

describe('useFavoritesCityStore', () => {
  beforeEach(() => {
    // 每个测试前重置状态
    useFavoritesCityStore.setState({ list: [] })
  })

  it('应该能添加城市到收藏列表', () => {
    const { addCity, list } = useFavoritesCityStore.getState()

    addCity({
      id: '101010100',
      name: '北京',
      adm2: '北京市',
      lon: '116.41',
      lat: '39.90',
    })

    expect(useFavoritesCityStore.getState().list).toHaveLength(1)
    expect(useFavoritesCityStore.getState().list[0].name).toBe('北京')
  })

  it('应该能删除收藏城市', () => {
    const { addCity, removeCity } = useFavoritesCityStore.getState()

    addCity({ id: '1', name: '北京', adm2: '北京市', lon: '116', lat: '39' })
    removeCity('1')

    expect(useFavoritesCityStore.getState().list).toHaveLength(0)
  })

  it('应该能判断城市是否已收藏', () => {
    const { addCity, isInList } = useFavoritesCityStore.getState()

    addCity({ id: '1', name: '北京', adm2: '北京市', lon: '116', lat: '39' })

    expect(isInList('1')).toBe(true)
    expect(isInList('999')).toBe(false)
  })
})
```

### 2.5 天气咨询项目中的测试价值

| 测试对象      | 测试内容                  | 价值             |
| ------------- | ------------------------- | ---------------- |
| Zustand Store | 添加/删除/判断收藏        | 确保状态管理正确 |
| 自定义 Hooks  | useDebouncedValue         | 确保防抖逻辑正确 |
| 工具函数      | buildPrompt（AI提示构建） | 确保输出格式正确 |
| 组件渲染      | ErrorBoundary             | 确保错误处理正确 |

---

## 三、如何在项目中实现 PWA

### 3.1 安装依赖

```bash
npm install -D vite-plugin-pwa
```

### 3.2 配置 vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo.png'],
      manifest: {
        name: '天气咨询',
        short_name: '天气',
        description: '智能天气查询应用',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'logo.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        // 运行时缓存策略
        runtimeCaching: [
          {
            // 缓存天气 API
            urlPattern: /^https:\/\/geoapi\.qweather\.com/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'weather-api',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5分钟过期
              },
            },
          },
          {
            // 缓存静态资源
            urlPattern: /^https:\/\/.*\.(js|css|png|jpg|svg)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-resources',
            },
          },
        ],
      },
    }),
  ],
})
```

### 3.3 缓存策略说明

| 策略             | 适用场景 | 行为                 |
| ---------------- | -------- | -------------------- |
| **NetworkFirst** | API 数据 | 优先网络，失败用缓存 |
| **CacheFirst**   | 静态资源 | 优先缓存，加速加载   |
| **NetworkOnly**  | 实时数据 | 只用网络，不缓存     |
| **CacheOnly**    | 离线资源 | 只用缓存             |

### 3.4 验证 PWA 是否生效

```bash
# 1. 构建项目
npm run build

# 2. 预览生产版本
npm run preview

# 3. 打开浏览器开发者工具
# - Application → Service Workers → 查看是否注册成功
# - Application → Manifest → 查看配置是否正确
# - Lighthouse → 运行 PWA 审计
```

---

## 四、如何在项目中实现 Vitest 测试

### 4.1 安装依赖

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @testing-library/user-event
```

### 4.2 配置 vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
```

### 4.3 创建测试设置文件

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom'
```

### 4.4 添加测试脚本

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

### 4.5 编写测试文件

```tsx
// src/hooks/__tests__/useDebouncedValue.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebouncedValue } from '../useDebouncedValue'

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('应该延迟更新值', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebouncedValue(value, delay), {
      initialProps: { value: 'initial', delay: 300 },
    })

    expect(result.current).toBe('initial')

    // 更新值
    rerender({ value: 'updated', delay: 300 })

    // 延迟期间，值应该还是初始值
    expect(result.current).toBe('initial')

    // 快进时间
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // 延迟后，值应该更新
    expect(result.current).toBe('updated')
  })

  it('应该在快速连续更新时只取最后一个值', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebouncedValue(value, delay), {
      initialProps: { value: 'a', delay: 300 },
    })

    // 快速连续更新
    rerender({ value: 'b', delay: 300 })
    rerender({ value: 'c', delay: 300 })
    rerender({ value: 'd', delay: 300 })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    // 应该只取最后一个值
    expect(result.current).toBe('d')
  })
})
```

### 4.6 运行测试

```bash
# 运行所有测试
npm run test

# 监听模式（开发时使用）
npm run test -- --watch

# 生成覆盖率报告
npm run test:coverage
```

---

## 五、PWA 与测试的关系

### 5.1 直接关系：Service Worker 测试

PWA 的核心是 Service Worker，需要测试：

```typescript
// 测试 Service Worker 注册
describe('Service Worker', () => {
  it('应该在生产环境注册 Service Worker', async () => {
    // 模拟生产环境
    vi.stubEnv('MODE', 'production')

    // 渲染应用
    render(<App />)

    // 等待 Service Worker 注册
    await waitFor(() => {
      expect(navigator.serviceWorker.register).toHaveBeenCalled()
    })
  })
})
```

### 5.2 间接关系：离线场景测试

测试 PWA 离线功能：

```typescript
// 测试离线时的数据展示
describe('离线模式', () => {
  it('应该在离线时显示缓存的天气数据', async () => {
    // 1. 先在线获取数据
    const { getByText } = render(<WeatherApp />)
    await waitFor(() => {
      expect(getByText('北京')).toBeInTheDocument()
    })

    // 2. 模拟离线
    await act(async () => {
      await window.dispatchEvent(new Event('offline'))
    })

    // 3. 验证离线提示
    expect(getByText(/离线模式/)).toBeInTheDocument()
  })
})
```

### 5.3 关系图

```
                    ┌─────────────────┐
                    │   工程化实践     │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ↓              ↓              ↓
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │   PWA    │   │   测试   │   │  CI/CD   │
        └────┬─────┘   └────┬─────┘   └────┬─────┘
             │              │              │
             │              │              │
    ┌────────┴────────┐    │    ┌────────┴────────┐
    │ 离线可用性测试   │    │    │ 自动化测试流水线 │
    │ Service Worker  │    │    │ 覆盖率检查      │
    │ 缓存策略验证    │    │    │ 回归测试        │
    └─────────────────┘    │    └─────────────────┘
                           │
                    ┌──────┴──────┐
                    │  质量保障   │
                    └─────────────┘
```

---

## 六、为什么进度报告把它们放在一起？

### 6.1 共同特征：工程化意识

| 维度         | PWA          | 测试         |
| ------------ | ------------ | ------------ |
| **目标**     | 提升用户体验 | 保障代码质量 |
| **性质**     | 工程化配置   | 工程化实践   |
| **学习成本** | 配置为主     | 编写为主     |
| **展示价值** | 技术广度     | 技术深度     |
| **时间成本** | 约30分钟     | 约1小时      |

### 6.2 阶段划分逻辑

```
项目开发阶段：
├── 阶段0-3：核心功能开发（必须有）
│   ├── 代码清理
│   ├── React Query
│   ├── Zustand
│   └── ECharts
│
├── 阶段4：工程化完善（锦上添花）
│   ├── PWA（用户体验优化）
│   └── 测试（代码质量保障）
│
├── 阶段5：差异化亮点（核心竞争力）
│   └── AI 智能点评
│
└── 阶段6：部署上线（交付）
    └── Vercel 部署
```

### 6.3 为什么不是分开的阶段？

**原因一：优先级相同**

两者都属于 **P2 优先级**（锦上添花，非核心功能），不影响主流程。

**原因二：技能层次相同**

```
技能层次：
┌─────────────────────────────────────┐
│  核心技能（必须掌握）                 │
│  React + TypeScript + 状态管理       │
└─────────────────────────────────────┘
              ↑
┌─────────────────────────────────────┐
│  工程化技能（加分项）                 │
│  PWA + 测试 + CI/CD                  │  ← 同一层次
└─────────────────────────────────────┘
              ↑
┌─────────────────────────────────────┐
│  差异化技能（核心竞争力）             │
│  AI 集成 + SSE 流式输出               │
└─────────────────────────────────────┘
```

**原因三：时间成本相近**

| 任务        | 时间     | 说明                 |
| ----------- | -------- | -------------------- |
| PWA 配置    | ~30分钟  | 主要是配置，代码量少 |
| Vitest 测试 | ~1小时   | 编写测试用例         |
| **合计**    | ~1.5小时 | 适合放在一个阶段     |

**原因四：面试关联**

面试官常把 PWA 和测试放在一起问：

> "你的项目有哪些工程化实践？"

回答可以涵盖：

- PWA 离线能力（用户体验）
- Vitest 单元测试（代码质量）
- ESLint/Prettier（代码规范）

### 6.4 分开的情况

如果项目复杂度高，可以分开：

| 情况                     | 建议处理                 |
| ------------------------ | ------------------------ |
| 大型项目                 | PWA 和测试分开成独立阶段 |
| 有专门的 QA 流程         | 测试单独成阶段           |
| 需要大量离线功能         | PWA 单独成阶段           |
| 天气咨询项目（学习项目） | 合并在一起更合理         |

---

## 七、面试要点总结

### 7.1 PWA 面试要点

| 问题                     | 答案要点                                         |
| ------------------------ | ------------------------------------------------ |
| 什么是 PWA？             | 渐进式 Web 应用，让网页像 App 一样运行           |
| PWA 核心技术？           | Service Worker + Manifest + HTTPS                |
| Service Worker 作用？    | 拦截请求、缓存资源、离线处理                     |
| 缓存策略有哪些？         | NetworkFirst、CacheFirst、NetworkOnly、CacheOnly |
| 为什么用 Vite PWA 插件？ | 开箱即用，自动生成 Service Worker                |

### 7.2 测试面试要点

| 问题                 | 答案要点                         |
| -------------------- | -------------------------------- |
| 为什么选 Vitest？    | Vite 项目专用，开箱即用，速度快  |
| 测试类型有哪些？     | 单元测试、集成测试、E2E 测试     |
| 什么是 TDD？         | 测试驱动开发：先写测试，再写代码 |
| 测试覆盖率多少合适？ | 核心逻辑 80%+，整体 60%+         |
| 测试的好处？         | 重构有信心、减少 bug、文档作用   |

### 7.3 工程化面试回答模板

```
面试官：你的项目有哪些工程化实践？

回答：
"我在项目中实践了完整的工程化体系：

1. 代码规范：ESLint + Prettier，统一代码风格
2. 类型安全：TypeScript 严格模式，verbatimModuleSyntax
3. 错误处理：ErrorBoundary 全局错误捕获
4. 离线能力：PWA + Service Worker，支持离线访问
5. 自动化测试：Vitest 单元测试，覆盖核心逻辑

其中 PWA 让用户在弱网环境下也能查看天气，测试确保代码质量，
这些都是为了提升用户体验和代码可维护性。"
```

---

## 📚 参考资料

### 官方文档

| 技术               | 链接                                                                |
| ------------------ | ------------------------------------------------------------------- |
| Vite PWA 插件      | https://vite-pwa-org.netlify.app/                                   |
| Vitest             | https://vitest.dev/                                                 |
| Testing Library    | https://testing-library.com/docs/react-testing-library/intro/       |
| Service Worker MDN | https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API |

### 学习资源

| 资源            | 说明                                  |
| --------------- | ------------------------------------- |
| Google PWA 指南 | https://web.dev/progressive-web-apps/ |
| Vitest 中文教程 | https://cn.vitest.dev/                |

---

**文档版本**：v1.0  
**创建时间**：2026-03-22  
**适用阶段**：阶段4 - PWA + 测试
