# fetch API 与流式响应处理

> 本文档记录 fetch API 的核心用法，包括请求配置、响应处理、流式读取等知识点。

---

## 一、fetch 基础

### 1.1 fetch 语法

```typescript
fetch(url, options?)
```

| 参数      | 类型   | 必填 | 说明         |
| --------- | ------ | ---- | ------------ |
| `url`     | string | ✅   | 请求地址     |
| `options` | object | ❌   | 请求配置对象 |

### 1.2 options 配置对象

**是否必须？** 不是必须的，不传就默认发送 GET 请求。

```typescript
// 简单 GET 请求
fetch('https://api.example.com/data')

// 带配置的请求
fetch('https://api.example.com/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: '张三' }),
})
```

### 1.3 常用配置属性

| 属性          | 作用                   | 示例                                     |
| ------------- | ---------------------- | ---------------------------------------- |
| `method`      | HTTP 方法              | `'GET'` `'POST'` `'PUT'` `'DELETE'`      |
| `headers`     | 请求头                 | `{ 'Content-Type': 'application/json' }` |
| `body`        | 请求体（必须是字符串） | `JSON.stringify({ ... })`                |
| `mode`        | 跨域模式               | `'cors'` `'no-cors'` `'same-origin'`     |
| `credentials` | 携带 cookie            | `'include'` `'same-origin'` `'omit'`     |
| `signal`      | 取消请求               | `controller.signal`                      |

---

## 二、POST 请求

### 2.1 POST 请求结构

```typescript
const response = await fetch(API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: [...],
    stream: true,
    temperature: 0.7,
    max_tokens: 500,
  }),
})
```

### 2.2 关键属性详解

| 属性                             | 作用                            |
| -------------------------------- | ------------------------------- |
| `method: 'POST'`                 | 发送数据必须用 POST             |
| `Content-Type: application/json` | 告诉服务器：我发的是 JSON       |
| `Authorization: Bearer xxx`      | API 认证的标准方式              |
| `body: JSON.stringify(...)`      | body 只接受字符串，所以要序列化 |

### 2.3 POST vs GET 对比

| 对比项   | GET          | POST             |
| -------- | ------------ | ---------------- |
| 用途     | 获取数据     | 发送数据         |
| body     | 无           | 有（必须序列化） |
| 缓存     | 可以缓存     | 通常不缓存       |
| 参数位置 | URL 查询参数 | body 中          |

---

## 三、Response 对象

### 3.1 Response 常用属性

```typescript
const response = await fetch(url)

response.ok // boolean，状态码 200-299 为 true
response.status // 状态码，如 200、404、500
response.statusText // 状态文本，如 "OK"、"Not Found"
response.headers // 响应头对象
response.body // ReadableStream（流式响应时使用）
```

### 3.2 Response 常用方法

| 方法            | 返回值                 | 说明             |
| --------------- | ---------------------- | ---------------- |
| `json()`        | Promise\<object\>      | 解析 JSON 响应   |
| `text()`        | Promise\<string\>      | 获取文本响应     |
| `blob()`        | Promise\<Blob\>        | 获取二进制数据   |
| `arrayBuffer()` | Promise\<ArrayBuffer\> | 获取 ArrayBuffer |

### 3.3 非流式响应处理

```typescript
const response = await fetch(url)

// 检查响应状态
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`)
}

// 解析 JSON
const data = await response.json()
console.log(data)
```

---

## 四、流式响应处理

### 4.1 什么是流式响应？

**流式响应（Streaming Response）**：服务器分块返回数据，客户端边接收边处理，而不是等全部数据返回后再处理。

```
传统响应：服务器 → 等待全部生成 → 一次性返回 → 客户端显示
流式响应：服务器 → 生成一块返回一块 → 客户端逐块显示
```

### 4.2 流式响应的优势

| 优势           | 说明                       |
| -------------- | -------------------------- |
| **即时反馈**   | 用户立即看到内容，不用等待 |
| **降低延迟感** | AI 生成时边生成边显示      |
| **节省内存**   | 不需要缓存全部响应         |
| **可中断**     | 用户可随时停止             |

### 4.3 getReader() 方法

`response.body` 是一个 `ReadableStream` 对象，通过 `getReader()` 获取读取器：

```typescript
const response = await fetch(url)

// 获取流读取器
const reader = response.body.getReader()
```

**为什么要用 getReader？**

| 方式                        | 处理方式     | 适用场景                   |
| --------------------------- | ------------ | -------------------------- |
| `response.json()`           | 等待全部数据 | 数据量小、不需要实时显示   |
| `response.body.getReader()` | 逐块读取     | 流式响应、大数据、实时显示 |

### 4.4 read() 方法

`reader.read()` 读取下一块数据，返回一个 Promise：

```typescript
const result = await reader.read()
// result = { done: boolean, value: Uint8Array }
```

| 属性    | 类型       | 说明                   |
| ------- | ---------- | ---------------------- |
| `done`  | boolean    | `true` 表示流已结束    |
| `value` | Uint8Array | 读取到的数据块（字节） |

### 4.5 完整流式读取流程

```typescript
const response = await fetch(API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: [...],
    stream: true, // 启用流式输出
  }),
})

// 获取流读取器
const reader = response.body.getReader()
const decoder = new TextDecoder()

// 循环读取
while (true) {
  const { done, value } = await reader.read()

  if (done) break // 流结束

  // 解码字节数据为文本
  const chunk = decoder.decode(value, { stream: true })
  console.log('收到数据块:', chunk)
}
```

### 4.6 流式读取流程图

```
fetch() 返回 Response
         │
         ▼
response.body (ReadableStream)
         │
         ▼
reader = response.body.getReader()
         │
         ▼
   ┌─────────────────┐
   │ while (true) {  │
   │   reader.read() │◀────┐
   │        │        │     │
   │        ▼        │     │
   │   { done, value }     │
   │        │        │     │
   │   ┌────┴────┐   │     │
   │   ▼         ▼   │     │
   │ done=true  其他  │─────┘
   │   │              │
   │   ▼              │
   │  break           │
   │  (结束)           │
   └─────────────────┘
```

---

## 五、TextDecoder

### 5.1 为什么需要 TextDecoder？

`reader.read()` 返回的 `value` 是 `Uint8Array`（字节数组），不是字符串。需要用 `TextDecoder` 转换：

```typescript
const decoder = new TextDecoder()

const bytes = new Uint8Array([72, 101, 108, 108, 111])
const text = decoder.decode(bytes)
console.log(text) // "Hello"
```

### 5.2 decode() 参数

```typescript
decoder.decode(value, { stream: true })
```

| 参数           | 说明                                   |
| -------------- | -------------------------------------- |
| `value`        | Uint8Array 字节数据                    |
| `stream: true` | 表示还有更多数据，处理跨块的多字节字符 |

---

## 六、完整示例：流式 AI 响应

```typescript
async function streamAIResponse(prompt: string) {
  const response = await fetch('https://api.deepseek.com/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    }),
  })

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullText = ''

  while (true) {
    const { done, value } = await reader.read()

    if (done) break

    const chunk = decoder.decode(value, { stream: true })

    // 解析 SSE 格式（每个 chunk 以 "data: " 开头）
    const lines = chunk.split('\n').filter(line => line.startsWith('data: '))

    for (const line of lines) {
      const jsonStr = line.replace('data: ', '')
      if (jsonStr === '[DONE]') continue

      try {
        const data = JSON.parse(jsonStr)
        const content = data.choices?.[0]?.delta?.content || ''
        fullText += content
        console.log(content) // 实时输出
      } catch (e) {
        // 忽略解析错误
      }
    }
  }

  return fullText
}
```

---

## 七、常见问题

### Q1: fetch 第二个参数是必须的吗？

**不是**。不传就默认发送 GET 请求。

```typescript
// 等价于 { method: 'GET' }
fetch('https://api.example.com/data')
```

### Q2: POST 请求必须设置 body 吗？

**不是必须**，但通常 POST 用于发送数据，所以会设置 body。

```typescript
// 无 body 的 POST（少见但合法）
fetch(url, { method: 'POST' })
```

### Q3: 为什么 body 要用 JSON.stringify？

因为 `body` 只接受字符串、Blob、FormData 等类型，不接受对象。

```typescript
// ❌ 错误：直接传对象
body: {
  name: '张三'
}

// ✅ 正确：序列化为字符串
body: JSON.stringify({ name: '张三' })
```

### Q4: response.json() 和 reader 有什么区别？

| 方式              | 返回时机         | 适用场景         |
| ----------------- | ---------------- | ---------------- |
| `response.json()` | 等待全部数据返回 | 普通请求         |
| `reader.read()`   | 逐块返回         | 流式响应、大数据 |

### Q5: 什么时候用流式读取？

- AI 对话（ChatGPT、DeepSeek 等）
- 大文件下载
- 实时日志流
- 视频流

---

## 八、面试要点

### 8.1 核心概念

1. **fetch 第二个参数是可选的**，不传默认 GET
2. **POST 必须设置 method 和 body**，body 必须是字符串
3. **流式响应用 `response.body.getReader()` + `reader.read()`**
4. **read() 返回 `{ done, value }`**，done=true 表示流结束
5. **value 是 Uint8Array**，需要 TextDecoder 转换

### 8.2 代码要点

```typescript
// 流式读取标准模式
const reader = response.body.getReader()
const decoder = new TextDecoder()

while (true) {
  const { done, value } = await reader.read()
  if (done) break
  const chunk = decoder.decode(value, { stream: true })
  // 处理 chunk
}
```

### 8.3 关键记忆

> ⭐ `fetch(url, options)` 的 options 可选，POST 必须设置 method 和 body
> ⭐ 流式响应：`response.body.getReader()` → `reader.read()` → `{ done, value }`
> ⭐ value 是 Uint8Array，用 `TextDecoder.decode()` 转字符串
