# 快速上手 Zustand

## 一、什么是 Zustand？

Zustand 是一个**轻量级、快速、可扩展**的 React 状态管理库。

### 核心特点

- ✅ **极简 API**：基于 hooks，无需样板代码
- ✅ **无需 Provider**：不需要包裹整个应用
- ✅ **类型安全**：优秀的 TypeScript 支持
- ✅ **性能优异**：基于选择器的精确更新
- ✅ **体积小巧**：gzip 后仅 1KB 左右
- ✅ **解决痛点**：处理了 zombie child、React 并发、上下文丢失等常见问题

### 与其他方案的对比

| 特性 | Zustand | Redux | Context API |
|------|---------|-------|-------------|
| 学习曲线 | 低 | 高 | 中 |
| 样板代码 | 极少 | 多 | 中 |
| 需要 Provider | ❌ 不需要 | ✅ 需要 | ✅ 需要 |
| 性能 | 优秀 | 良好 | 较差（大对象时） |
| TypeScript 支持 | 原生支持 | 需要配置 | 原生支持 |
| 调试工具 | 有 | 有（成熟） | 无 |

---

## 二、安装

```bash
# npm
npm install zustand

# yarn
yarn add zustand

# pnpm
pnpm add zustand
```

---

## 三、运行原理（通俗版）

### 3.1 为什么 `create()` 返回的是一个 Hook？

**一句话总结**：为了让 React 组件能自动响应状态变化。

#### 问题场景

假设我们用最简单的方式设计状态管理：

```typescript
// ❌ 如果 Zustand 直接返回一个普通对象
const store = {
  count: 0,
  setCount: (val) => { store.count = val }
}

function Counter() {
  return <div>{store.count}</div>  // 状态变了，组件不会重新渲染！
}
```

**问题**：当 `store.count` 变化时，React 组件不知道，界面不会更新。

#### Zustand 的解决方案

```typescript
// ✅ Zustand 返回一个 Hook
const useCountStore = create((set) => ({
  count: 0,
  setCount: (val) => set({ count: val })
}))

function Counter() {
  const count = useCountStore((state) => state.count)  // 订阅状态
  return <div>{count}</div>  // 状态变了，组件自动重新渲染！
}
```

**核心原理**：
1. `create()` 内部创建了一个 **store**（存储状态）
2. 返回的 `useCountStore` 是一个 **React Hook**
3. Hook 内部使用了 React 18 的 `useSyncExternalStore` API
4. 当状态变化时，Hook 通知 React："数据变了，请重新渲染"

---

### 3.2 内部发生了什么？（简化版）

```
┌─────────────────────────────────────────────────────────┐
│                    create() 调用时                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   1. 创建 Store（普通 JS 对象）                            │
│      ├── state: { count: 0 }                            │
│      ├── listeners: Set()  // 订阅者列表                  │
│      └── setState() 函数                                 │
│                                                          │
│   2. 返回一个 Hook 函数                                    │
│      └── useCountStore(selector)                        │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              组件中使用 Hook 时                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   const count = useCountStore((state) => state.count)   │
│                     │                                    │
│                     ▼                                    │
│   1. 执行 selector，提取需要的值                          │
│   2. 将组件加入 listeners 列表（订阅）                     │
│   3. 返回 count 值给组件使用                              │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              调用 setCount() 更新状态时                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   setCount(5)                                           │
│       │                                                 │
│       ▼                                                 │
│   1. 更新 store.state = { count: 5 }                    │
│   2. 遍历 listeners，通知所有订阅的组件                   │
│   3. React 触发组件重新渲染                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 3.3 为什么需要 selector（选择器）？

#### 问题：全量订阅导致不必要的渲染

```typescript
// ❌ 订阅整个 store
function UserName() {
  const store = useUserStore()  // 订阅整个对象
  
  return <div>{store.name}</div>
  // 即使 age 变了，这个组件也会重新渲染！
}

// ❌ 对比 Context API
const UserContext = createContext({ name: 'Tom', age: 18 })
function UserName() {
  const { name } = useContext(UserContext)  // 整个对象变化就渲染
  return <div>{name}</div>
}
```

#### 解决：精确订阅需要的状态

```typescript
// ✅ 只订阅 name
function UserName() {
  const name = useUserStore((state) => state.name)  // 只订阅 name
  
  return <div>{name}</div>
  // age 变化时，这个组件不会重新渲染！
}
```

**原理**：
- selector 函数决定了你"关心"哪部分状态
- Zustand 会比较 selector 返回值是否变化（浅比较）
- 只有当值变化时，才触发组件重渲染

---

### 3.4 TypeScript 类型是如何工作的？

#### 问题：为什么不能自动推断类型？

```typescript
// ❌ TypeScript 无法推断类型
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}))

// state 被推断为 unknown！
useStore((state) => state.count)  // ❌ 类型错误
```

**原因**（技术细节）：
- `create` 函数的类型参数 `T` 同时出现在：
  - **参数位置**（contravariant）：`set` 函数接收 `state`
  - **返回位置**（covariant）：返回 `state`
- 这种"不变量"（invariant）情况，TypeScript 无法推断，默认为 `unknown`

#### 解决：显式提供类型

```typescript
// ✅ 使用 create<T>()() 语法
interface Store {
  count: number
  increment: () => void
}

const useStore = create<Store>()((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}))

// 现在有完整的类型提示
useStore((state) => state.count)  // ✅ 类型为 number
useStore((state) => state.increment)  // ✅ 类型为 () => void
```

#### TypeScript 类型推断流程

```
create<Store>()((set) => ({ ... }))
    │              │
    │              └── set 函数现在知道 state 的类型
    │
    └── 告诉 TypeScript：Store 的类型结构

        │
        ▼
useStore((state) => state.count)
                │          │
                │          └── TypeScript 知道 count 是 number
                │
                └── state 参数自动获得 Store 类型
```

---

### 3.5 无需 Provider 的秘密

**传统方案（Redux/Context）**：

```typescript
// 需要在根组件包裹 Provider
<Provider store={store}>
  <App />
</Provider>
```

**Zustand**：

```typescript
// 直接使用，不需要 Provider
const useStore = create(...)

function App() {
  const count = useStore((state) => state.count)  // 直接用！
}
```

**原理**：
- Zustand 的 store 是一个**全局变量**
- 不依赖 React Context，而是直接引用
- 每个 Hook 调用时，直接访问这个全局 store

```typescript
// 简化版内部实现
let globalStore = { state: {}, listeners: new Set() }

function createStore(stateCreator) {
  globalStore.state = stateCreator()
  return function useStore(selector) {
    // React Hook 内部
    useSyncExternalStore(
      (callback) => globalStore.listeners.add(callback),
      () => globalStore.state
    )
    return selector(globalStore.state)
  }
}
```

---

### 3.6 总结：一张图理解 Zustand

```
                    create() 函数
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
    ┌──────────┐                 ┌─────────────┐
    │  Store   │                 │    Hook     │
    │ (全局对象) │                 │ (React组件用)│
    └──────────┘                 └─────────────┘
          │                             │
    ┌─────┴─────┐                       │
    │           │                       │
    ▼           ▼                       ▼
  state      listeners            useStore(selector)
    │           │                       │
    │           │                       │
    │           └───────┬───────────────┘
    │                   │
    │                   ▼
    │           ┌──────────────┐
    │           │ React 组件    │
    │           │ (订阅状态变化) │
    │           └──────────────┘
    │                   │
    │                   │ 渲染时
    │                   ▼
    └──────────► 显示 state 数据
```

**关键点**：
1. **Store** = 状态 + 订阅列表（全局变量）
2. **Hook** = 连接 Store 和 React 组件的桥梁
3. **Selector** = 决定组件"关心"哪部分状态
4. **setState** = 更新状态 + 通知所有订阅者

---

## 四、基础使用

### 3.1 创建 Store

```typescript
import { create } from 'zustand'

// 定义状态类型
interface BearStore {
  bears: number
  increase: (by: number) => void
  decrease: (by: number) => void
  reset: () => void
}

// 创建 store
const useBearStore = create<BearStore>((set) => ({
  bears: 0,
  
  // 增加熊的数量
  increase: (by) => set((state) => ({ bears: state.bears + by })),
  
  // 减少熊的数量
  decrease: (by) => set((state) => ({ bears: state.bears - by })),
  
  // 重置
  reset: () => set({ bears: 0 }),
}))
```

### 3.2 在组件中使用

```tsx
import { useBearStore } from './store'

function BearCounter() {
  // ✅ 推荐：使用选择器，只订阅需要的状态
  const bears = useBearStore((state) => state.bears)
  
  return <h1>{bears} bears around here...</h1>
}

function BearControls() {
  // ✅ 推荐：分别选择状态和方法
  const increase = useBearStore((state) => state.increase)
  const decrease = useBearStore((state) => state.decrease)
  const reset = useBearStore((state) => state.reset)
  
  return (
    <div>
      <button onClick={() => increase(1)}>增加一只熊</button>
      <button onClick={() => decrease(1)}>减少一只熊</button>
      <button onClick={reset}>重置</button>
    </div>
  )
}
```

### 3.3 状态更新方式

```typescript
const useStore = create((set) => ({
  count: 0,
  
  // 方式1：直接更新
  increment: () => set({ count: 1 }),
  
  // 方式2：基于旧状态更新
  increment: () => set((state) => ({ count: state.count + 1 })),
  
  // 方式3：更新多个字段
  updateMultiple: () => set((state) => ({
    count: state.count + 1,
    lastUpdated: Date.now(),
  })),
  
  // 方式4：异步更新
  asyncIncrement: async () => {
    const data = await fetchCount()
    set({ count: data })
  },
}))
```

---

## 五、进阶用法

### 4.1 持久化存储（persist）

自动将状态保存到 localStorage/sessionStorage：

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserStore {
  name: string
  setName: (name: string) => void
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      name: '',
      setName: (name) => set({ name }),
    }),
    {
      name: 'user-storage', // localStorage 的 key
      // 可选：自定义序列化
      storage: createJSONStorage(() => sessionStorage),
      // 可选：只持久化部分状态
      partialize: (state) => ({ name: state.name }),
    },
  ),
)
```

### 4.2 开发者工具（devtools）

集成 Redux DevTools 调试：

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useStore = create(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    { name: 'MyStore' }, // DevTools 中显示的名称
  ),
)
```

### 4.3 组合使用中间件

```typescript
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const useStore = create(
  devtools(
    persist(
      (set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
      }),
      { name: 'counter-storage' },
    ),
    { name: 'CounterStore' },
  ),
)
```

### 4.4 异步操作

```typescript
interface TodoStore {
  todos: Todo[]
  loading: boolean
  error: string | null
  fetchTodos: () => Promise<void>
}

const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  loading: false,
  error: null,
  
  fetchTodos: async () => {
    set({ loading: true, error: null })
    
    try {
      const response = await fetch('/api/todos')
      const todos = await response.json()
      set({ todos, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
}))
```

### 4.5 在组件外使用

```typescript
// store.ts
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))

// 在组件外访问或修改状态
useStore.getState().count // 获取当前状态
useStore.getState().increment() // 调用方法
useStore.setState({ count: 10 }) // 直接设置状态

// 订阅状态变化
const unsubscribe = useStore.subscribe((state) => {
  console.log('状态变化:', state.count)
})
unsubscribe() // 取消订阅
```

---

## 六、TypeScript 最佳实践

### 5.1 完整类型定义

```typescript
// store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// 分离状态和操作类型
type State = {
  bears: number
  name: string
}

type Actions = {
  increase: (by: number) => void
  decrease: (by: number) => void
  reset: () => void
  setName: (name: string) => void
}

type BearStore = State & Actions

const useBearStore = create<BearStore>()(
  devtools(
    (set) => ({
      // 初始状态
      bears: 0,
      name: 'Yogi',
      
      // 操作
      increase: (by) => set((state) => ({ bears: state.bears + by })),
      decrease: (by) => set((state) => ({ bears: state.bears - by })),
      reset: () => set({ bears: 0 }),
      setName: (name) => set({ name }),
    }),
    { name: 'BearStore' },
  ),
)

export default useBearStore
export type { State, Actions, BearStore }
```

### 5.2 选择器类型推断

```typescript
// 自动类型推断
const bears = useBearStore((state) => state.bears) // number
const name = useBearStore((state) => state.name) // string

// 批量选择
const { bears, name } = useBearStore((state) => ({
  bears: state.bears,
  name: state.name,
}))
```

---

## 七、实战示例

### 6.1 购物车 Store

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.id === item.id)
        if (existingItem) {
          return {
            items: state.items.map(i =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          }
        }
        return { items: [...state.items, { ...item, quantity: 1 }] }
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id),
      })),
      
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(i =>
          i.id === id ? { ...i, quantity } : i
        ),
      })),
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        const state = get()
        return state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
    }),
    { name: 'cart-storage' },
  ),
)

export default useCartStore
```

### 6.2 表单状态管理

```typescript
import { create } from 'zustand'

interface FormState {
  values: Record<string, any>
  errors: Record<string, string>
  setFieldValue: (field: string, value: any) => void
  setFieldError: (field: string, error: string) => void
  reset: () => void
}

const useFormStore = create<FormState>((set) => ({
  values: {},
  errors: {},
  
  setFieldValue: (field, value) => set((state) => ({
    values: { ...state.values, [field]: value },
  })),
  
  setFieldError: (field, error) => set((state) => ({
    errors: { ...state.errors, [field]: error },
  })),
  
  reset: () => set({ values: {}, errors: {} }),
}))

// 使用
function MyForm() {
  const values = useFormStore((state) => state.values)
  const setFieldValue = useFormStore((state) => state.setFieldValue)
  
  return (
    <input
      value={values.username || ''}
      onChange={(e) => setFieldValue('username', e.target.value)}
    />
  )
}
```

---

## 八、性能优化技巧

### 8.1 使用选择器避免不必要的渲染

```typescript
// ❌ 不好：订阅整个 store，任何变化都会重新渲染
const store = useBearStore()

// ✅ 好：只订阅需要的状态
const bears = useBearStore((state) => state.bears)
const increase = useBearStore((state) => state.increase)

// ✅ 好：使用 shallow 比较多个值
import { shallow } from 'zustand/shallow'

const { bears, name } = useBearStore(
  (state) => ({ bears: state.bears, name: state.name }),
  shallow,
)
```

### 8.2 选择器优化

```typescript
// 使用 useMemo 优化复杂选择器
const filteredTodos = useTodoStore(
  useCallback((state) => state.todos.filter(todo => todo.completed), []),
)
```

---

## 九、常见问题

### Q1：Zustand 和 Redux 如何选择？

- **选择 Zustand**：中小型项目、追求简洁、快速开发
- **选择 Redux**：大型项目、需要严格的状态管理模式、团队熟悉 Redux

### Q2：需要多个 Store 吗？

**单个 Store**：适合状态有交互的场景
**多个 Store**：适合模块化、状态独立的场景

```typescript
// 多个 store 示例
const useUserStore = create(/* ... */)
const useCartStore = create(/* ... */)
const useThemeStore = create(/* ... */)
```

### Q3：如何处理复杂状态逻辑？

可以使用 **slices** 模式：

```typescript
import { create } from 'zustand'

const createBearSlice = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
})

const createFishSlice = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
})

const useStore = create((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
}))
```

---

## 十、总结

### 核心原理回顾

**为什么返回 Hook？**
- React 组件需要响应状态变化自动更新
- Hook 内部使用 `useSyncExternalStore` 连接外部 store 和 React
- 当状态变化时，自动通知订阅的组件重新渲染

**TypeScript 为什么需要 `create<T>()()` 语法？**
- 类型参数 T 是"不变量"（invariant）
- TypeScript 无法同时从参数和返回值推断
- 显式提供类型后，获得完整的类型安全和自动补全

### Zustand 的优势

1. **简单**：几乎没有学习曲线，API 极简
2. **轻量**：包体积小，对项目影响最小
3. **灵活**：不强制特定模式，自由度高
4. **类型安全**：TypeScript 支持一流
5. **无 Provider**：无需包裹应用，直接使用
6. **性能好**：基于选择器的精确更新

**适用场景**：
- ✅ React 应用状态管理
- ✅ 中小型项目
- ✅ 需要快速开发的项目
- ✅ TypeScript 项目
- ✅ 需要持久化的状态

**不适用场景**：
- ❌ 需要严格 Flux 架构的大型团队
- ❌ 需要完整时间旅行调试功能

---

## 十一、参考资源

- [官方文档](https://zustand.docs.pmnd.rs/)
- [GitHub 仓库](https://github.com/pmndrs/zustand)
- [示例项目](https://github.com/pmndrs/zustand/tree/main/examples)