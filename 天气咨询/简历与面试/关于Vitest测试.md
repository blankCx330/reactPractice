# Vitest 测试快速上手指南

> **创建时间**：2026-03-22
>
> **适用项目**：天气咨询 React 项目
>
> **目标**：1 小时内学会写简单测试，展示工程化意识

---

## 📖 目录

1. [为什么需要测试？](#一为什么需要测试)
2. [测试类型介绍](#二测试类型介绍)
3. [TDD 概念](#三tdd-概念)
4. [环境配置](#四环境配置)
5. [实战：写第一个测试](#五实战写第一个测试)
6. [实战：测试 Zustand Store](#六实战测试-zustand-store)
7. [面试要点](#七面试要点)

---

## 一、为什么需要测试？

### 1.1 测试的价值

| 价值         | 说明                         |
| ------------ | ---------------------------- |
| **发现 Bug** | 在用户发现之前发现问题       |
| **重构信心** | 有测试保护，敢于修改代码     |
| **文档作用** | 测试即文档，展示如何使用代码 |
| **团队协作** | 新人能快速理解代码行为       |

### 1.2 没有测试的后果

```
场景：你修改了一个函数
    ↓
"应该没问题吧？"
    ↓
上线了
    ↓
用户反馈：XXX 功能坏了
    ↓
紧急修复、加班、背锅...
```

**有测试的情况**：

```
场景：你修改了一个函数
    ↓
运行测试 → 3 个测试失败
    ↓
"哦，这里有问题"
    ↓
修复代码 → 测试全部通过
    ↓
放心上线 ✅
```

---

## 二、测试类型介绍

### 2.1 测试金字塔

```
                    ┌─────────┐
                    │  E2E    │  端到端测试
                    │  测试   │  - 模拟真实用户操作
                    ├─────────┤  - 覆盖完整流程
                    │  集成   │  集成测试
                    │  测试   │  - 多个模块协同工作
                    ├─────────┤  - API 调用测试
               ┌────┴─────────┴────┐
               │    单元测试       │  单元测试 ⭐ 最重要
               │                   │  - 测试单个函数/组件
               │                   │  - 速度快、数量多
               └───────────────────┘
```

### 2.2 测试类型对比

| 类型     | 测试对象   | 速度  | 编写难度 | 面试价值   |
| -------- | ---------- | ----- | -------- | ---------- |
| 单元测试 | 函数、组件 | ⚡ 快 | 简单     | ⭐⭐⭐⭐⭐ |
| 集成测试 | 模块协作   | 🚗 中 | 中等     | ⭐⭐⭐⭐   |
| E2E 测试 | 完整流程   | 🐢 慢 | 复杂     | ⭐⭐⭐     |

**实习面试**：掌握单元测试即可，写 1-2 个简单测试就能展示。

---

## 三、TDD 概念

### 3.1 什么是 TDD？

**TDD（Test-Driven Development，测试驱动开发）** 是一种先写测试再写代码的开发方式。

### 3.2 TDD 流程

```
┌─────────────────────────────────────────┐
│                                         │
│    ┌─────────┐                          │
│    │  RED    │  1. 写一个失败的测试      │
│    └────┬────┘                          │
│         ↓                               │
│    ┌─────────┐                          │
│    │  GREEN  │  2. 写最少代码让测试通过  │
│    └────┬────┘                          │
│         ↓                               │
│    ┌─────────┐                          │
│    │REFACTOR │  3. 优化代码             │
│    └────┬────┘                          │
│         │                               │
│         └──────────→ 重复               │
│                                         │
└─────────────────────────────────────────┘
```

### 3.3 TDD 的好处

| 好处       | 说明                       |
| ---------- | -------------------------- |
| 更好的设计 | 为了可测试，代码会更模块化 |
| 更少的 Bug | 测试覆盖率高               |
| 重构信心   | 有测试保护，敢于修改       |
| 文档作用   | 测试即文档                 |

---

## 四、环境配置

### 4.1 安装依赖

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @testing-library/user-event
```

### 4.2 创建配置文件

在项目根目录创建 `vitest.config.ts`：

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

创建 `src/test/setup.ts`：

```typescript
import '@testing-library/jest-dom'
```

### 4.4 添加测试脚本

在 `package.json` 中添加：

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## 五、实战：写第一个测试

### 5.1 最简单的测试

创建 `src/__tests__/example.test.ts`：

```typescript
import { describe, it, expect } from 'vitest'

describe('基础测试示例', () => {
  it('1 + 1 应该等于 2', () => {
    expect(1 + 1).toBe(2)
  })

  it('字符串应该包含特定内容', () => {
    expect('天气咨询').toContain('天气')
  })

  it('数组应该包含特定元素', () => {
    const list = ['北京', '上海', '广州']
    expect(list).toContain('北京')
    expect(list).toHaveLength(3)
  })
})
```

### 5.2 运行测试

```bash
npm run test
```

**输出**：

```
 ✓ src/__tests__/example.test.ts (3)
   ✓ 基础测试示例 (3)
     ✓ 1 + 1 应该等于 2
     ✓ 字符串应该包含特定内容
     ✓ 数组应该包含特定元素

Test Files  1 passed (1)
     Tests  3 passed (3)
```

### 5.3 常用断言方法

| 断言方法         | 说明     | 示例                                        |
| ---------------- | -------- | ------------------------------------------- |
| `toBe()`         | 严格相等 | `expect(1).toBe(1)`                         |
| `toEqual()`      | 深度相等 | `expect({a: 1}).toEqual({a: 1})`            |
| `toContain()`    | 包含     | `expect([1, 2]).toContain(1)`               |
| `toHaveLength()` | 长度     | `expect([1, 2]).toHaveLength(2)`            |
| `toBeTruthy()`   | 真值     | `expect(true).toBeTruthy()`                 |
| `toBeFalsy()`    | 假值     | `expect(false).toBeFalsy()`                 |
| `toThrow()`      | 抛出错误 | `expect(() => throw new Error()).toThrow()` |

---

## 六、实战：测试 Zustand Store

### 6.1 测试收藏 Store

创建 `src/hooks/__tests__/useFavoritesCityStore.test.ts`：

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useFavoritesCityStore } from '../useFavoritesCityStore'

describe('useFavoritesCityStore', () => {
  // 每个测试前重置状态
  beforeEach(() => {
    useFavoritesCityStore.setState({ list: [] })
  })

  describe('addCity', () => {
    it('应该能添加城市到收藏列表', () => {
      const { addCity } = useFavoritesCityStore.getState()

      addCity({
        id: '101010100',
        name: '北京',
        adm2: '北京市',
        lon: '116.41',
        lat: '39.90',
      })

      const list = useFavoritesCityStore.getState().list
      expect(list).toHaveLength(1)
      expect(list[0].name).toBe('北京')
    })

    it('不应该重复添加同一个城市', () => {
      const { addCity } = useFavoritesCityStore.getState()

      addCity({
        id: '101010100',
        name: '北京',
        adm2: '北京市',
        lon: '116.41',
        lat: '39.90',
      })

      addCity({
        id: '101010100',
        name: '北京',
        adm2: '北京市',
        lon: '116.41',
        lat: '39.90',
      })

      expect(useFavoritesCityStore.getState().list).toHaveLength(1)
    })
  })

  describe('removeCity', () => {
    it('应该能删除收藏城市', () => {
      const { addCity, removeCity } = useFavoritesCityStore.getState()

      addCity({
        id: '101010100',
        name: '北京',
        adm2: '北京市',
        lon: '116.41',
        lat: '39.90',
      })

      removeCity('101010100')

      expect(useFavoritesCityStore.getState().list).toHaveLength(0)
    })
  })

  describe('isInList', () => {
    it('应该能判断城市是否已收藏', () => {
      const { addCity, isInList } = useFavoritesCityStore.getState()

      addCity({
        id: '101010100',
        name: '北京',
        adm2: '北京市',
        lon: '116.41',
        lat: '39.90',
      })

      expect(isInList('101010100')).toBe(true)
      expect(isInList('999999999')).toBe(false)
    })
  })
})
```

### 6.2 运行测试

```bash
npm run test
```

**输出**：

```
 ✓ src/hooks/__tests__/useFavoritesCityStore.test.ts (5)
   ✓ useFavoritesCityStore (5)
     ✓ addCity (2)
       ✓ 应该能添加城市到收藏列表
       ✓ 不应该重复添加同一个城市
     ✓ removeCity (1)
       ✓ 应该能删除收藏城市
     ✓ isInList (1)
       ✓ 应该能判断城市是否已收藏

Test Files  1 passed (1)
     Tests  5 passed (5)
```

---

## 七、面试要点

### 7.1 面试官可能问的问题

| 问题                     | 参考回答                                                                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| **你写过测试吗？**       | "我在项目中用 Vitest 写过单元测试，比如给 Zustand Store 写了测试，确保 addCity、removeCity 等方法正常工作。"                     |
| **什么是 TDD？**         | "TDD 是测试驱动开发，流程是先写失败的测试（RED），再写代码让测试通过（GREEN），最后优化代码（REFACTOR）。这样可以保证代码质量。" |
| **测试有什么好处？**     | "测试可以提前发现 Bug、给重构提供信心、作为文档展示代码用法。在团队协作中，测试可以保证修改不会破坏现有功能。"                   |
| **你怎么保证代码质量？** | "我通过 TypeScript 保证类型安全，用 ESLint/Prettier 保证代码风格，还写了单元测试保证功能正确性。这套组合可以有效提升代码质量。"  |

### 7.2 面试回答模板

```
"我在项目中实践了完整的工程化体系：

1. TypeScript 严格模式保证类型安全
2. ESLint + Prettier 保证代码风格统一
3. 用 Vitest 写了单元测试

比如给 Zustand Store 写了测试，
测试了添加城市、删除城市、判断是否已收藏等功能。
虽然测试不多，但我理解测试的价值，
以后在更复杂的项目中会更注重测试覆盖。"
```

### 7.3 加分点

| 加分点            | 说明                               |
| ----------------- | ---------------------------------- |
| ✅ 写过测试       | 比"我知道测试很重要但没写过"强很多 |
| ✅ 理解 TDD       | 展示你对软件工程的重视             |
| ✅ 能解释测试价值 | 展示你的工程化思维                 |
| ✅ 提到测试覆盖率 | 展示你了解行业指标                 |

---

## 📚 参考资料

### 官方文档

| 资源            | 链接                                                          |
| --------------- | ------------------------------------------------------------- |
| Vitest 官方文档 | https://vitest.dev/                                           |
| Testing Library | https://testing-library.com/docs/react-testing-library/intro/ |
| Jest DOM        | https://github.com/testing-library/jest-dom                   |

### 学习建议

| 时间    | 任务                    |
| ------- | ----------------------- |
| 30 分钟 | 理解测试概念 + TDD      |
| 30 分钟 | 配置环境 + 写第一个测试 |
| 30 分钟 | 给项目中一个功能写测试  |

---

## ⭐ 总结

> **测试 = 工程化意识的体现**
>
> - 写 1 个简单测试 > 完全没写过
> - 面试官看重测试意识，不要求精通
> - 花 1 小时学习，面试时能展示即可

---

**文档版本**：v1.0  
**创建时间**：2026-03-22  
**适用阶段**：阶段4 - Vitest 测试
