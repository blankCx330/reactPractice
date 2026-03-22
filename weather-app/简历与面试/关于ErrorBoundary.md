# Error Boundary 深入理解与实践指南

> **目标**：理解 Error Boundary 原理，掌握如何在项目中实现与使用
>
> **适用场景**：React Query 深化阶段 — 为项目添加全局错误处理能力

---

## 一、什么是 Error Boundary？

### 1.1 问题背景

React 默认行为：**当组件渲染过程中抛出错误，整个组件树会卸载，页面白屏。**

```
用户点击按钮 → 组件报错 → 整个页面崩溃 → 白屏
```

这就像一艘船上有个洞，整艘船都沉了。我们需要的是"隔舱"——某个区域出错，只影响这个区域，其他部分正常工作。

### 1.2 解决方案

**Error Boundary** = React 的"错误隔舱"

```
<ErrorBoundary>
  <WeatherApp />    ← 如果这里出错
</ErrorBoundary>

结果：只显示错误提示，而不是白屏
```

### 1.3 核心概念

| 概念           | 说明                                                           |
| -------------- | -------------------------------------------------------------- |
| **是什么**     | 一种特殊的 React 组件，能捕获子组件树的渲染错误                |
| **捕获什么**   | 渲染过程中的错误、生命周期方法中的错误、子组件构造函数中的错误 |
| **不捕获什么** | 事件处理器中的错误、异步代码中的错误、服务端渲染的错误         |

---

## 二、为什么必须是 Class 组件？

### 2.1 React 官方限制

**Error Boundary 只能用 Class 组件实现，不能用函数组件。**

原因：React 需要两个特殊的生命周期方法：

```tsx
// 这两个方法只能在 Class 组件中定义
static getDerivedStateFromError(error)  // 更新状态，显示备用 UI
componentDidCatch(error, errorInfo)      // 记录错误信息
```

### 2.2 函数组件的替代方案

如果你坚持用函数组件，可以：

1. **使用现成库**：`react-error-boundary`（推荐）
2. **自己封装 Class 组件**，然后以函数式 API 暴露

---

## 三、核心 API 详解

### 3.1 `getDerivedStateFromError(error)`

```tsx
static getDerivedStateFromError(error: Error) {
  // 返回一个对象，用来更新 state
  return { hasError: true, error }
}
```

**作用**：捕获错误后，更新组件状态，触发重新渲染

**特点**：

- 静态方法（没有 this）
- 纯函数（不能有副作用）
- 返回值会合并到 state

### 3.2 `componentDidCatch(error, errorInfo)`

```tsx
componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  // 可以执行副作用：日志上报、发送到监控平台
  console.error('捕获到错误：', error)
  console.error('组件堆栈：', errorInfo.componentStack)
}
```

**作用**：错误发生后的回调，用于日志记录

**参数**：

- `error`：抛出的错误对象
- `errorInfo.componentStack`：错误发生时的组件调用栈

### 3.3 两者的区别

| 方法                       | 用途                    | 能否有副作用 |
| -------------------------- | ----------------------- | ------------ |
| `getDerivedStateFromError` | 更新 state，显示备用 UI | ❌ 不能      |
| `componentDidCatch`        | 日志记录、错误上报      | ✅ 可以      |

---

## 四、完整实现示例

### 4.1 基础版 Error Boundary

```tsx
// src/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode // 子组件
  fallback?: ReactNode // 可选的自定义错误 UI
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  // 步骤1：捕获错误，更新状态
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  // 步骤2：记录错误（可选）
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary 捕获到错误：', error)
    console.error('组件堆栈：', errorInfo.componentStack)

    // 这里可以添加错误上报逻辑
    // logErrorToService(error, errorInfo)
  }

  // 步骤3：根据状态渲染不同内容
  render(): ReactNode {
    if (this.state.hasError) {
      // 显示备用 UI
      return (
        this.props.fallback || (
          <div className="error-fallback">
            <h2>出错了</h2>
            <p>{this.state.error?.message}</p>
            <button onClick={() => window.location.reload()}>刷新页面</button>
          </div>
        )
      )
    }

    // 正常渲染子组件
    return this.props.children
  }
}

export default ErrorBoundary
```

### 4.2 进阶版：支持重置功能

```tsx
// src/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void // 重置回调
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary 捕获到错误：', error)
    console.error('组件堆栈：', errorInfo.componentStack)
  }

  // 重置错误状态
  resetError = (): void => {
    this.props.onReset?.() // 调用外部重置逻辑
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="error-fallback">
            <h2>出错了</h2>
            <p>{this.state.error?.message}</p>
            <button onClick={this.resetError}>重试</button>
          </div>
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
```

---

## 五、在项目中如何使用

### 5.1 当前项目状态分析

你的项目结构：

```
src/
├── main.tsx          ← 应用入口
├── App.tsx           ← 包装层
├── WeatherApp.tsx    ← 主应用组件
├── ErroeMessage.tsx  ← 已有错误组件（文件名有拼写错误）
└── hooks/
    └── useUserLocation.tsx  ← 使用 TanStack Query
```

当前错误处理：

- ✅ `TopContainer.tsx` 有 `isError` 状态处理
- ✅ `ErrorMessage` 组件已存在
- ❌ 没有全局 Error Boundary
- ❌ 组件级错误会导致白屏

### 5.2 使用位置

**最佳实践：分层包裹**

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ErrorBoundary from './components/ErrorBoundary'
import App from './App.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
)
```

### 5.3 组件级 Error Boundary

对于复杂的组件，可以单独包裹：

```tsx
// 例如：给天气数据展示区域单独加错误边界
<ErrorBoundary fallback={<div>天气数据加载失败</div>}>
  <LeftContainer />
</ErrorBoundary>

<ErrorBoundary fallback={<div>详情数据加载失败</div>}>
  <RightContainer />
</ErrorBoundary>
```

---

## 六、理解 QueryClient 与 QueryClientProvider

在使用 Error Boundary 之前，需要理解你的项目入口文件中的两个关键概念。

### 6.1 QueryClient 是什么？

**QueryClient = 查询客户端实例**，是 TanStack Query 的核心大脑。

```tsx
const queryClient = new QueryClient()
```

它管理的职责：

| 职责         | 说明                                               |
| ------------ | -------------------------------------------------- |
| **缓存管理** | 存储所有查询数据                                   |
| **全局配置** | 设置默认的 staleTime、cacheTime、重试策略等        |
| **查询操作** | 提供方法来手动操作查询（invalidate、reset、clear） |

**常用方法**：

```tsx
const queryClient = new QueryClient()

// 手动让某个查询失效（触发重新请求）
queryClient.invalidateQueries({ queryKey: ['weather'] })

// 手动设置缓存数据
queryClient.setQueryData(['weather'], newData)

// 获取缓存数据
const data = queryClient.getQueryData(['weather'])

// 清除所有缓存
queryClient.clear()
```

**全局配置示例**：

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 数据5分钟内新鲜
      gcTime: 10 * 60 * 1000, // 缓存10分钟后回收
      retry: 2, // 失败重试2次
      refetchOnWindowFocus: false, // 窗口聚焦不自动刷新
    },
  },
})
```

### 6.2 QueryClientProvider 是什么？

**QueryClientProvider = React Context Provider**，让整个组件树都能访问到 QueryClient。

```tsx
<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

**为什么需要它？**

TanStack Query 使用 React Context 机制来共享 QueryClient：

```
QueryClientProvider
       ↓ 提供上下文
   ┌───┴───┐
  App    其他组件
   ↓       ↓
useQuery  useQuery  ← 都能访问同一个 QueryClient
```

**没有它会怎样？**

```tsx
// ❌ 错误：useQuery 找不到 QueryClient
function MyComponent() {
  const { data } = useQuery({ queryKey: ['test'], queryFn: fetchTest })
  // 报错：No QueryClient set, use QueryClientProvider to set one
}
```

### 6.3 三者的关系图

```
┌─────────────────────────────────────────────────────┐
│                    应用入口                          │
│                                                     │
│  const queryClient = new QueryClient()             │
│         ↓                                           │
│  <ErrorBoundary>                                   │
│         ↓                                           │
│    <QueryClientProvider client={queryClient}>      │
│           ↓ 提供上下文                              │
│        <App>                                       │
│           ↓                                         │
│        <WeatherApp>                                │
│           ↓                                         │
│        useQuery() ← 通过 Context 访问 queryClient  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 6.4 与 ErrorBoundary 的关系

它们是不同层面的东西：

| 概念                    | 层面   | 职责                      |
| ----------------------- | ------ | ------------------------- |
| **QueryClient**         | 数据层 | 管理请求、缓存、数据      |
| **QueryClientProvider** | 注入层 | 让组件能访问 QueryClient  |
| **ErrorBoundary**       | 错误层 | 捕获渲染错误，显示备用 UI |

**包裹顺序很重要**：

```tsx
// ✅ 正确顺序：ErrorBoundary 在最外层
<ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
</ErrorBoundary>
```

**为什么这样包裹？**

| 场景                 | ErrorBoundary 在外层的作用 |
| -------------------- | -------------------------- |
| QueryClient 创建失败 | 能捕获并显示错误 UI        |
| Provider 内部错误    | 能捕获子组件渲染错误       |
| useQuery 数据异常    | 配合 `throwOnError` 可捕获 |

**类比理解**：

| 概念                    | 类比       | 一句话说明                         |
| ----------------------- | ---------- | ---------------------------------- |
| **QueryClient**         | 数据库连接 | 管理所有数据请求和缓存的大管家     |
| **QueryClientProvider** | 插座       | 把"数据库连接"插到组件树的每个角落 |
| **ErrorBoundary**       | 断路器     | 出错时切断影响范围，显示备用方案   |

---

## 七、与 TanStack Query 配合

### 7.1 Error Boundary 与 Query Error 的区别

| 场景           | Error Boundary | TanStack Query isError |
| -------------- | -------------- | ---------------------- |
| 渲染时抛出错误 | ✅ 捕获        | ❌ 不捕获              |
| API 请求失败   | ❌ 不捕获      | ✅ 捕获                |
| 异步代码错误   | ❌ 不捕获      | ✅ 捕获                |

### 7.2 最佳实践：两者结合

```tsx
// 组件中同时使用两种错误处理
function WeatherSection() {
  const { data, isLoading, isError, error } = useWeatherQuery()

  // 处理 Query 错误（API 失败）
  if (isError) {
    return <ErrorMessage message={error.message} />
  }

  // 渲染时可能抛出的错误，由 Error Boundary 捕获
  return (
    <div>
      <h1>{data.weather.temp}</h1> {/* 如果 data 结构异常，会触发 ErrorBoundary */}
    </div>
  )
}
```

### 7.3 React Query 的 Error Boundary 模式

TanStack Query 支持 `throwOnError` 选项，让错误冒泡到 Error Boundary：

```tsx
// 当查询失败时，抛出错误让 Error Boundary 捕获
const { data } = useQuery({
  queryKey: ['weather'],
  queryFn: fetchWeather,
  throwOnError: true, // 错误会抛出到 ErrorBoundary
})
```

---

## 八、面试常见问题

### Q1：Error Boundary 能捕获哪些错误？

**答案**：

- ✅ 渲染过程中的错误
- ✅ 生命周期方法中的错误
- ✅ 子组件构造函数中的错误
- ❌ 事件处理器中的错误（需要 try-catch）
- ❌ 异步代码中的错误（如 setTimeout、Promise）
- ❌ 服务端渲染中的错误
- ❌ Error Boundary 自身抛出的错误

### Q2：为什么只能用 Class 组件？

**答案**：因为 `getDerivedStateFromError` 和 `componentDidCatch` 是 React 类组件特有的生命周期方法，函数组件没有对应的功能。这是 React 团队的设计决定。

### Q3：Error Boundary 和 try-catch 有什么区别？

| 对比项           | Error Boundary | try-catch        |
| ---------------- | -------------- | ---------------- |
| 捕获时机         | 渲染阶段       | 任何阶段         |
| 捕获范围         | 子组件树       | 当前代码块       |
| 能否捕获事件错误 | ❌             | ✅               |
| 能否捕获异步错误 | ❌             | ✅               |
| 使用场景         | 组件级错误隔离 | 具体代码错误处理 |

### Q4：如何实现错误上报？

```tsx
componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  // 发送到错误监控平台
  fetch('/api/log-error', {
    method: 'POST',
    body: JSON.stringify({
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    })
  })
}
```

---

## 九、实施步骤总结

### 你的项目需要做的：

| 步骤 | 任务                         | 文件                                    |
| ---- | ---------------------------- | --------------------------------------- |
| 1    | 创建 ErrorBoundary 组件      | `src/components/ErrorBoundary.tsx`      |
| 2    | 在 main.tsx 包裹应用         | `src/main.tsx`                          |
| 3    | 可选：组件级错误边界         | `src/WeatherApp.tsx`                    |
| 4    | 修复 ErrorMessage 文件名拼写 | `ErroeMessage.tsx` → `ErrorMessage.tsx` |

### 预期效果：

```
之前：
组件报错 → 整个页面白屏 → 用户困惑

之后：
组件报错 → 显示错误提示 → 其他功能正常使用
```

---

## 十、参考资源

- [React 官方文档 - Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [TanStack Query - Error Handling](https://tanstack.com/query/latest/docs/react/guides/error-handling)
- [react-error-boundary 库](https://github.com/bvaughn/react-error-boundary)

---

**文档版本**：v1.1  
**创建日期**：2026-03-16  
**更新日期**：2026-03-16  
**适用项目**：天气咨询 React 应用
