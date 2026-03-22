我应该如何配置 Prettier？（只进行指导）

---

## 我的回答

### 配置步骤概览

```
完整流程：
├── 第一步：安装依赖
├── 第二步：创建配置文件
├── 第三步：添加 npm 脚本
├── 第四步：配置 VS Code（推荐）
└── 第五步：格式化现有代码
```

---

### 第一步：安装依赖

在项目根目录执行：

```bash
npm install -D prettier eslint-config-prettier
```

| 依赖 | 作用 |
|-----|------|
| `prettier` | 核心格式化工具 |
| `eslint-config-prettier` | 关闭 ESLint 中与 Prettier 冲突的规则 |

**为什么需要 `eslint-config-prettier`？**

ESLint 和 Prettier 有部分规则重叠（如缩进、引号）。如果不加这个包，两者可能冲突，导致"ESLint 报错但 Prettier 认为正确"的情况。

---

### 第二步：创建配置文件

在项目根目录创建 `.prettierrc` 文件：

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

#### 配置项说明

| 配置项 | 值 | 效果 |
|-------|-----|------|
| `semi` | `false` | 不加分号 |
| `singleQuote` | `true` | 使用单引号 |
| `tabWidth` | `2` | 缩进 2 空格 |
| `trailingComma` | `"es5"` | ES5 支持的地方加尾逗号（对象、数组） |
| `printWidth` | `100` | 每行最大 100 字符 |
| `bracketSpacing` | `true` | 对象花括号内加空格 `{ foo: 1 }` |
| `arrowParens` | `"avoid"` | 单参数箭头函数不加括号 `x => x` |

#### 你可以根据偏好调整

```json
// 如果你喜欢加分号
{ "semi": true }

// 如果你喜欢双引号
{ "singleQuote": false }

// 如果你喜欢单参数也加括号
{ "arrowParens": "always" }
```

**建议**：团队项目统一配置，个人项目随心所欲。

---

### 第三步：添加 npm 脚本

在 `package.json` 的 `scripts` 中添加：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css,json}\""
  }
}
```

#### 脚本说明

| 脚本 | 命令 | 用途 |
|-----|------|------|
| `format` | 格式化并写入文件 | 本地开发时使用 |
| `format:check` | 只检查不修改 | CI 中检查格式是否一致 |

#### 运行方式

```bash
# 格式化所有代码
npm run format

# 检查格式（CI 用）
npm run format:check
```