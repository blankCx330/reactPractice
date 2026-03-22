# 什么是 ESLint？是 Vite 自带的吗？

## 你的疑问

> 什么是 ESLint？这个是我 Vite React 项目自带的吗？

---

## 我的回答

### 一句话回答

**ESLint 是代码质量检查工具，你的项目配置是 Vite 官方模板自带的。**

---

### 什么是 ESLint？

#### 简单理解

ESLint 就像一个**代码审查助手**，在你写代码时帮你发现问题：

```
你写的代码 → ESLint 检查 → 报告问题（错误/警告）
```

#### 它能检查什么？

| 类别 | 示例问题 | 严重程度 |
|-----|---------|---------|
| **语法错误** | 变量未定义、未使用 | ❌ 错误 |
| **最佳实践** | 使用 `var` 而非 `let/const` | ⚠️ 警告 |
| **React 规范** | Hooks 在条件语句中调用 | ❌ 错误 |
| **类型问题** | TypeScript 类型不匹配 | ❌ 错误 |
| **代码风格** | 缺少分号（需配置） | ⚠️ 警告 |

#### 实际例子

```tsx
// ❌ ESLint 会报错：'unused' is assigned a value but never used
const unused = 123;

// ❌ ESLint 会报错：React Hook "useState" is called conditionally
if (condition) {
  const [state, setState] = useState(0);
}

// ✅ ESLint 通过
const [state, setState] = useState(0);
```

#### 为什么重要？

| 好处 | 说明 |
|-----|------|
| **提前发现 bug** | 运行前就发现问题，而不是上线后崩 |
| **统一代码风格** | 团队协作时，代码看起来像一个人写的 |
| **学习最佳实践** | ESLint 报错会教你正确写法 |
| **面试加分** | 大厂必备，体现工程化意识 |

---

### 是 Vite 自带的吗？

#### 答案：是的

你的 ESLint 配置来自 **Vite 官方 React-TS 模板**。

#### 证据

1. **配置文件格式** - `eslint.config.js` 使用的是 ESLint 9 的 **flat config** 格式，这是 Vite 最新模板采用的配置方式

2. **依赖版本** - 你的 `package.json` 中：
   ```json
   "eslint": "^9.39.1",
   "typescript-eslint": "^8.46.4",
   "eslint-plugin-react-hooks": "^7.0.1",
   "eslint-plugin-react-refresh": "^0.4.24"
   ```
   这些都是 Vite 模板默认包含的

3. **创建命令** - 你应该是这样创建项目的：
   ```bash
   npm create vite@latest weather -- --template react-ts
   ```
   这个命令会自动生成 ESLint 配置

#### Vite 模板默认包含什么？

| 包含项 | 用途 |
|-------|------|
| `eslint` | 核心 lint 引擎 |
| `typescript-eslint` | TypeScript 语法解析 + 规则 |
| `eslint-plugin-react-hooks` | React Hooks 规则检查 |
| `eslint-plugin-react-refresh` | Fast Refresh 兼容性检查 |

---

### 你不需要自己配置

Vite 已经帮你做好了：

```
Vite 模板自带：
├── eslint.config.js ─────── 配置文件（flat config 格式）
├── TypeScript 规则 ───────── 检查类型错误
├── React Hooks 规则 ──────── 检查 hooks 用法
└── React Refresh 规则 ────── 确保 Fast Refresh 正常工作
```

#### 运行方式

```bash
# 检查代码
npm run lint

# 检查并自动修复（如果有可修复的问题）
npm run lint -- --fix
```

---

### ESLint vs TypeScript vs Prettier

很多人容易混淆这三个工具：

| 工具 | 职责 | 检查什么 |
|-----|------|---------|
| **TypeScript** | 类型检查 | 变量类型、函数签名、接口匹配 |
| **ESLint** | 代码质量 | 最佳实践、潜在 bug、React 规范 |
| **Prettier** | 代码格式 | 缩进、引号、分号、换行 |

```
代码 ─→ TypeScript 编译 ─→ 类型错误？
   └── ESLint 检查 ───────→ 代码质量问题？
   └── Prettier 格式化 ───→ 格式不一致？
```

**三者互补，不冲突。**

---

### 总结

| 问题 | 答案 |
|-----|------|
| ESLint 是什么？ | 代码质量检查工具，帮你发现 bug 和不规范代码 |
| 是 Vite 自带的吗？ | **是**，Vite React-TS 模板默认包含 |
| 需要自己配置吗？ | **不需要**，开箱即用 |
| 怎么用？ | `npm run lint` 检查，`npm run lint -- --fix` 自动修复 |

> **一句话**：ESLint 是 Vite 送你的"代码审查助手"，开箱即用，不用折腾。
