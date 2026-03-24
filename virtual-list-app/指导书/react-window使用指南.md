# React-Window 使用指南

> **生成日期**：2026-03-23
> 
> **适用版本**：react-window v2.x（支持 React 18/19）
> 
> **目标**：掌握虚拟列表库的核心用法，能够独立实现高性能长列表

---

## ⚠️ 重要提示：v1 与 v2 API 差异

**react-window v2 进行了破坏性 API 更新**，与 v1 完全不兼容。以下是关键差异对照：

| 特性 | v1 API | v2 API |
|------|--------|--------|
| **组件名** | `FixedSizeList`, `VariableSizeList` | `List`（统一） |
| **列表项数量** | `itemCount` | `rowCount` |
| **列表项高度** | `itemSize` | `rowHeight` |
| **容器尺寸** | `height`, `width` props | 父容器设置 + `style` prop |
| **渲染方式** | `children` render prop | `rowComponent` prop |
| **传递数据** | `itemData` | `rowProps` |

> **本指南基于 v2 API 编写**。如果你看到其他教程使用 `FixedSizeList`、`itemCount`、`height` 等，那是 v1 的写法，不再适用。

---

## 📋 一、概述

### 1.1 什么是 react-window？

react-window 是一个 React 虚拟列表组件库，由 Brian Vaughn（React 核心团队成员）开发维护。

| 指标 | 数据 |
|------|------|
| GitHub Stars | 17.1k+ |
| 周下载量 | 300万+ |
| 体积 | ~6KB gzipped |
| 维护状态 | 活跃维护 |

### 1.2 为什么需要虚拟列表？

| 场景 | 无虚拟列表 | 有虚拟列表 |
|------|-----------|-----------|
| 10000 条数据 | 10000 个 DOM 节点 | ~20 个 DOM 节点 |
| 首屏渲染时间 | 500-1000ms | 50-100ms |
| 滚动 FPS | 30-45 帧 | 60 帧 |
| 内存占用 | 高 | 低 |

**核心原理**：只渲染可视区域内的元素，通过 `transform` 定位实现滚动效果。

### 1.3 适用场景

| ✅ 适合 | ❌ 不适合 |
|---------|----------|
| 长列表（100+ 条） | 短列表（< 20 条） |
| 聊天记录、商品列表 | 固定内容页面 |
| 数据表格 | 复杂交互组件 |
| 搜索结果 | 嵌套滚动容器 |

---

## 🚀 二、快速开始

### 2.1 安装

```bash
# 核心库（v2 支持 React 18/19）
npm install react-window

# 可选：自动尺寸适配
npm install react-virtualized-auto-sizer

# 可选：无限滚动加载
npm install react-window-infinite-loader
```

> **注意**：v2 不再需要 `@types/react-window`，类型已内置。

### 2.2 最简示例

```tsx
import { List, type RowComponentProps } from 'react-window';

// 定义行数据类型（rowProps 的类型）
interface RowProps {
  items: string[];
}

// ⚠️ 重要：rowProps 的属性会直接展开到组件 props 中！
// 不是 ({ index, style, rowProps })，而是直接解构属性
const RowComponent = ({ index, style, items }: RowComponentProps<RowProps>) => {
  const item = items[index];  // 直接访问，不是 rowProps.items
  return (
    <div style={style} className="p-4 border-b hover:bg-gray-50">
      {item}
    </div>
  );
};

function App() {
  const items = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`);

  return (
    // 父容器设置尺寸（v2 不再有 height/width props）
    <div style={{ height: 400, width: '100%' }}>
      <List
        rowComponent={RowComponent}
        rowCount={items.length}
        rowHeight={50}
        rowProps={{ items }}  // 传入 { items: [...] }
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
}
```

### 2.3 核心概念图解

```
┌─────────────────────────────────┐
│        可视区域 (viewport)        │  ← 父容器高度决定
│  ┌───────────────────────────┐  │
│  │     overscan (上缓冲区)    │  │
│  ├───────────────────────────┤  │
│  │                           │  │
│  │     可见列表项              │  │  ← 实际渲染的 DOM
│  │                           │  │
│  ├───────────────────────────┤  │
│  │     overscan (下缓冲区)    │  │
│  └───────────────────────────┘  │
│                                 │
│  ████████████████████████████   │  ← 未渲染，使用 transform 定位
│  ████████████████████████████   │
└─────────────────────────────────┘
```

---

## 📚 三、核心 API

### 3.1 组件概览

| 组件 | 用途 | 说明 |
|------|------|------|
| `List` | 列表（统一） | 固定/可变高度都使用此组件 |
| `Grid` | 网格（统一） | 固定/可变尺寸都使用此组件 |

### 3.2 List 组件详解

#### 必需 Props

| Prop | 类型 | 说明 |
|------|------|------|
| `rowComponent` | `React.ComponentType<RowComponentProps>` | 行渲染组件 |
| `rowCount` | `number` | 列表项总数 |
| `rowHeight` | `number \| (index: number) => number` | 行高度（像素）或高度函数 |
| `rowProps` | `object` | 传递给行组件的数据 |

#### 可选 Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `style` | `CSSProperties` | - | 列表容器样式 |
| `className` | `string` | - | 容器 CSS 类名 |
| `overscanCount` | `number` | 1 | 上下额外渲染的条数 |
| `listRef` | `RefObject` | - | 命令式 API 引用 |
| `onRowsRendered` | `function` | - | 渲染完成回调 |
| `tagName` | `string` | `"div"` | 根 HTML 元素 |

#### RowComponentProps 类型

> **重要**：`rowProps` 的属性会**直接展开**到组件 props 中，不是作为嵌套属性！

```typescript
// 实际类型定义（简化）
type RowComponentProps<RowProps> = {
    ariaAttributes: {
        "aria-posinset": number;
        "aria-setsize": number;
        role: "listitem";
    };
    index: number;           // 行索引
    style: CSSProperties;    // 位置和尺寸样式（必须应用到根元素）
} & RowProps;                // ← rowProps 的属性直接展开到这里！

// 示例：如果 RowProps = { items: string[] }
// 那么组件收到的 props 就是：{ index, style, ariaAttributes, items }
```

#### 完整示例：文章列表

```tsx
import { useState, useCallback, memo } from 'react';
import { List, type RowComponentProps, useListRef } from 'react-window';

interface Article {
  id: number;
  title: string;
  author: string;
}

interface RowProps {
  articles: Article[];
}

// 使用 memo 优化性能
// ⚠️ 注意：直接解构 articles，不是 rowProps.articles
const ArticleRow = memo(function ArticleRow({ 
  index, 
  style, 
  articles  // ← 直接解构，来自 rowProps={{ articles }}
}: RowComponentProps<RowProps>) {
  const article = articles[index];
  
  return (
    <div style={style} className="flex items-center px-4 border-b border-gray-200">
      <div className="flex-1">
        <h3 className="font-medium">{article.title}</h3>
        <p className="text-sm text-gray-500">{article.author}</p>
      </div>
    </div>
  );
});

function ArticleList({ articles }: { articles: Article[] }) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
  const listRef = useListRef(null);

  const handleRowsRendered = useCallback(({ startIndex, stopIndex }: { 
    startIndex: number; 
    stopIndex: number 
  }) => {
    setVisibleRange({ start: startIndex, end: stopIndex });
  }, []);

  return (
    <div className="flex flex-col h-[500px]">
      <div className="text-sm text-gray-400 mb-2">
        显示: {visibleRange.start + 1} - {visibleRange.end + 1} / {articles.length}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <List
          listRef={listRef}
          rowComponent={ArticleRow}
          rowCount={articles.length}
          rowHeight={80}
          rowProps={{ articles }}  // 传入 { articles: [...] }
          overscanCount={3}
          onRowsRendered={handleRowsRendered}
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </div>
  );
}
```

### 3.3 可变高度列表

当列表项高度不同时，`rowHeight` 传入函数：

```tsx
import { useCallback, useRef, memo } from 'react';
import { List, type RowComponentProps, useListRef } from 'react-window';

interface Message {
  id: string;
  content: string;
  type: 'text' | 'image' | 'video';
}

interface RowProps {
  messages: Message[];
}

// ⚠️ 注意：直接解构 messages
const MessageRow = memo(function MessageRow({ 
  index, 
  style, 
  messages  // ← 直接解构，来自 rowProps={{ messages }}
}: RowComponentProps<RowProps>) {
  const message = messages[index];
  
  return (
    <div style={style} className="px-4 py-2">
      <div className="bg-blue-100 rounded-lg p-3">
        {message.type === 'image' ? (
          <img src={message.content} alt="" className="max-w-full rounded" />
        ) : (
          <p>{message.content}</p>
        )}
      </div>
    </div>
  );
});

function ChatList({ messages }: { messages: Message[] }) {
  const listRef = useListRef(null);

  // 根据内容类型计算高度
  const getRowHeight = useCallback((index: number) => {
    const message = messages[index];
    switch (message.type) {
      case 'text':
        const lineCount = Math.ceil(message.content.length / 30);
        return Math.max(60, lineCount * 24 + 20);
      case 'image':
        return 200;
      case 'video':
        return 280;
      default:
        return 60;
    }
  }, [messages]);

  return (
    <div style={{ height: 600, width: '100%' }}>
      <List
        listRef={listRef}
        rowComponent={MessageRow}
        rowCount={messages.length}
        rowHeight={getRowHeight}  // 函数形式
        rowProps={{ messages }}
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
}
```

### 3.4 Grid 组件

用于表格、图片网格等二维布局。

#### 必需 Props

| Prop | 类型 | 说明 |
|------|------|------|
| `cellComponent` | `React.ComponentType<CellComponentProps>` | 单元格渲染组件 |
| `columnCount` | `number` | 列数 |
| `columnWidth` | `number \| (index: number) => number` | 列宽 |
| `rowCount` | `number` | 行数 |
| `rowHeight` | `number \| (index: number) => number` | 行高 |
| `cellProps` | `object` | 传递给单元格的数据 |

#### 示例：图片网格

```tsx
import { Grid, type CellComponentProps, useGridRef } from 'react-window';

interface CellData {
  images: string[];
  columnCount: number;
}

const ImageCell = ({ 
  columnIndex, 
  rowIndex, 
  style, 
  cellProps 
}: CellComponentProps<CellData>) => {
  const { images, columnCount } = cellProps;
  const index = rowIndex * columnCount + columnIndex;
  
  if (index >= images.length) return null;

  return (
    <div style={style} className="p-1">
      <img 
        src={images[index]} 
        alt="" 
        className="w-full h-full object-cover rounded"
      />
    </div>
  );
};

function ImageGrid({ images }: { images: string[] }) {
  const COLUMN_COUNT = 3;
  const CELL_SIZE = 150;
  const gridRef = useGridRef(null);

  return (
    <div style={{ 
      height: 500, 
      width: CELL_SIZE * COLUMN_COUNT 
    }}>
      <Grid
        gridRef={gridRef}
        cellComponent={ImageCell}
        columnCount={COLUMN_COUNT}
        columnWidth={CELL_SIZE}
        rowCount={Math.ceil(images.length / COLUMN_COUNT)}
        rowHeight={CELL_SIZE}
        cellProps={{ images, columnCount: COLUMN_COUNT }}
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
}
```

---

## 🎯 四、高级用法

### 4.1 命令式 API（Ref 方法）

通过 `useListRef` hook 获取列表实例，实现程序化滚动。

#### 可用方法

| 方法 | 参数 | 说明 |
|------|------|------|
| `scrollToRow(options)` | `{ index, align?, behavior? }` | 滚动到指定行 |
| `scrollTo(offset)` | `number` | 滚动到指定像素位置 |
| `getScrollElement()` | - | 获取滚动容器 DOM 元素 |

#### 示例：滚动控制

```tsx
import { useCallback } from 'react';
import { List, type RowComponentProps, useListRef } from 'react-window';

function ScrollableList() {
  const listRef = useListRef(null);
  const items = Array.from({ length: 1000 }, (_, i) => `Item ${i}`);

  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToRow({ index: 0, align: 'start' });
  }, []);

  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollToRow({ 
      index: items.length - 1, 
      align: 'end' 
    });
  }, [items.length]);

  const scrollToIndex = useCallback((index: number) => {
    listRef.current?.scrollToRow({ index, align: 'center' });
  }, []);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={scrollToTop}>回到顶部</button>
        <button onClick={scrollToBottom}>滚动到底部</button>
        <button onClick={() => scrollToIndex(500)}>跳转到第500条</button>
      </div>
      
      <div style={{ height: 400, width: '100%' }}>
        <List
          listRef={listRef}
          rowComponent={({ index, style, items }) => (
            <div style={style}>{items[index]}</div>
          )}
          rowCount={items.length}
          rowHeight={50}
          rowProps={{ items }}
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </div>
  );
}
```

#### scrollToRow 的 align 参数

| 值 | 效果 |
|----|------|
| `'start'` | 对齐到容器顶部 |
| `'center'` | 对齐到容器中央 |
| `'end'` | 对齐到容器底部 |
| `'smart'` | 仅在需要时滚动（智能模式） |
| `'auto'` | 默认，最小化滚动距离 |

### 4.2 AutoSizer 自动适配

让列表自动适应父容器尺寸。

```bash
npm install react-virtualized-auto-sizer
```

```tsx
import AutoSizer from 'react-virtualized-auto-sizer';
import { List, type RowComponentProps } from 'react-window';

function ResponsiveList({ items }: { items: string[] }) {
  return (
    // 父容器必须有明确高度
    <div style={{ height: '100vh' }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            rowComponent={({ index, style, items }) => (
              <div style={style}>{items[index]}</div>
            )}
            rowCount={items.length}
            rowHeight={50}
            rowProps={{ items }}
            style={{ height, width }}
          />
        )}
      </AutoSizer>
    </div>
  );
}
```

**⚠️ 常见错误**：AutoSizer 的父容器必须有明确高度，否则 height/width 会是 0。

### 4.3 InfiniteLoader 无限滚动

实现滚动到底部自动加载更多。

```bash
npm install react-window-infinite-loader
```

```tsx
import { useState, useCallback, memo } from 'react';
import { List, type RowComponentProps, useListRef } from 'react-window';
import { useInfiniteLoader } from 'react-window-infinite-loader';

interface RowProps {
  items: (string | null)[];
}

// ⚠️ 注意：直接解构 items
const LoadingRow = memo(function LoadingRow({ 
  index, 
  style, 
  items  // ← 直接解构
}: RowComponentProps<RowProps>) {
  const item = items[index];
  
  return (
    <div style={style} className="px-4 py-2 border-b">
      {item || <span className="text-gray-400">加载中...</span>}
    </div>
  );
});

function InfiniteList() {
  const [items, setItems] = useState<(string | null)[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useListRef(null);

  const isItemLoaded = useCallback((index: number) => {
    return index < items.length && items[index] !== null;
  }, [items]);

  const loadMoreItems = useCallback(async (startIndex: number, stopIndex: number) => {
    // 模拟 API 请求
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newItems = Array.from(
      { length: stopIndex - startIndex + 1 },
      (_, i) => `Item ${startIndex + i}`
    );
    
    setItems(prev => {
      const next = [...prev];
      newItems.forEach((item, i) => {
        next[startIndex + i] = item;
      });
      return next;
    });

    if (items.length >= 100) {
      setHasMore(false);
    }
  }, [items.length]);

  const itemCount = hasMore ? items.length + 10 : items.length;

  const onRowsRendered = useInfiniteLoader({
    isItemLoaded,
    loadMoreItems,
    rowCount: itemCount,
    threshold: 5,
  });

  return (
    <div style={{ height: 500, width: '100%' }}>
      <List
        listRef={listRef}
        rowComponent={LoadingRow}
        rowCount={itemCount}
        rowHeight={50}
        rowProps={{ items }}
        onRowsRendered={onRowsRendered}
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
}
```

---

## ⚡ 五、性能优化

### 5.1 组件记忆化（最重要！）

```tsx
import { memo, useMemo } from 'react';
import { List, type RowComponentProps } from 'react-window';

interface Item {
  id: number;
  name: string;
}

interface RowProps {
  items: Item[];
}

// ✅ 正确：使用 memo 包裹行组件
// ⚠️ 注意：直接解构 items
const Row = memo(function Row({ 
  index, 
  style, 
  items  // ← 直接解构
}: RowComponentProps<RowProps>) {
  const item = items[index];
  return (
    <div style={style}>
      {item.name}
    </div>
  );
});

function ListComponent() {
  // ✅ 正确：稳定的 rowProps 引用
  const items = useMemo(() => [...], [deps]);
  
  return (
    <div style={{ height: 400, width: '100%' }}>
      <List
        rowComponent={Row}
        rowCount={items.length}
        rowHeight={50}
        rowProps={{ items }}
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
}
```

### 5.2 避免内联组件

```tsx
// ❌ 错误：每次渲染创建新组件
<List
  rowComponent={({ index, style, items }) => (
    <div style={style} onClick={() => handleClick(index)}>
      {items[index]}
    </div>
  )}
/>

// ✅ 正确：使用稳定的组件引用 + memo
// ⚠️ 注意：直接解构 items 和 onClick
const Row = memo(function Row({ index, style, items, onClick }: RowComponentProps<RowProps>) {
  return (
    <div style={style} onClick={() => onClick(index)}>
      {items[index]}
    </div>
  );
});

<List
  rowComponent={Row}
  rowProps={{ items, onClick: handleClick }}
/>
```

### 5.3 overscanCount 调优

| 值 | 优点 | 缺点 | 适用场景 |
|----|------|------|----------|
| `1`（默认） | 内存占用小 | 快速滚动可能白屏 | 简单列表 |
| `3-5` | 滚动更流畅 | 稍多 DOM 节点 | 一般场景 |
| `10+` | 几乎无白屏 | 内存占用增加 | 复杂卡片 |

### 5.4 性能对比测试

```tsx
// 测试代码
function PerformanceTest() {
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
  }));

  // 使用 Chrome DevTools Performance 录制
  return (
    <div style={{ height: 600, width: '100%' }}>
      <List
        rowComponent={({ index, style, items }) => (
          <div style={style}>{items[index].name}</div>
        )}
        rowCount={items.length}
        rowHeight={50}
        rowProps={{ items }}
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
}
```

**测试方法**：
1. 打开 Chrome DevTools → Performance
2. 点击录制 → 滚动列表 5 秒 → 停止录制
3. 查看 FPS、CPU 占用、内存使用

---

## 🐛 六、常见问题

### 6.1 列表不显示（高度为 0）

**原因**：父容器没有明确高度。

```tsx
// ❌ 错误：父容器无高度
<div className="flex-1">
  <List ... />  {/* v2 没有 height prop，高度由父容器决定 */}
</div>

// ✅ 正确：给父容器明确高度
<div style={{ height: '100vh' }}>
  <List ... />
</div>

// ✅ 正确：配合 AutoSizer
<div style={{ height: '100vh' }}>
  <AutoSizer>
    {({ height, width }) => (
      <List style={{ height, width }} ... />
    )}
  </AutoSizer>
</div>
```

### 6.2 滚动位置跳动

**原因**：`rowHeight` 函数返回值不稳定。

```tsx
// ❌ 错误：每次调用返回不同值
const getRowHeight = (index: number) => {
  return Math.random() * 100;  // 随机高度！
};

// ✅ 正确：使用缓存
const heightCache = useRef<Map<number, number>>(new Map());

const getRowHeight = useCallback((index: number) => {
  if (!heightCache.current.has(index)) {
    heightCache.current.set(index, estimateHeight(index));
  }
  return heightCache.current.get(index)!;
}, []);
```

### 6.3 快速滚动时出现白屏

**解决方案**：

1. 增加 `overscanCount`
2. 简化行组件渲染逻辑
3. 使用骨架屏占位

```tsx
// ⚠️ 注意：直接解构 items
const Row = memo(function Row({ index, style, items }: RowComponentProps<RowProps>) {
  const item = items[index];
  
  if (!item) {
    return (
      <div style={style} className="animate-pulse bg-gray-200" />
    );
  }
  
  return <div style={style}>{item.name}</div>;
});
```

### 6.4 页面返回时滚动位置丢失

**解决**：保存和恢复滚动位置。

```tsx
import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

function PersistentScrollList() {
  const listRef = useListRef(null);
  const location = useLocation();

  // 恢复滚动位置
  useEffect(() => {
    const savedOffset = sessionStorage.getItem(`scroll-${location.key}`);
    if (savedOffset) {
      listRef.current?.scrollTo(parseInt(savedOffset, 10));
    }
  }, [location.key]);

  // 保存滚动位置（需要监听滚动事件）
  // v2 的滚动事件处理方式略有不同

  return <List listRef={listRef} ... />;
}
```

---

## 📊 七、与本项目集成

### 7.1 项目依赖确认

```json
// package.json
{
  "dependencies": {
    "react-window": "^2.2.7"
  }
}
```

> **注意**：v2 不再需要 `@types/react-window`，类型已内置。

### 7.2 改造现有 ArticleList

```tsx
// src/components/ArticleList/index.tsx
import { memo, useMemo } from 'react';
import { List, type RowComponentProps, useListRef } from 'react-window';
import ArticleItem from './ArticleItem';

interface Article {
  id: string;
  title: string;
  description: string;
  language: string;
  stars: string;
}

interface RowData {
  articles: Article[];
}

const ArticleRow = memo(function ArticleRow({ 
  index, 
  style, 
  articles  // ← 直接解构，来自 rowProps={{ articles }}
}: RowComponentProps<RowProps>) {
  const article = articles[index];
  return (
    <div style={style}>
      <ArticleItem article={article} />
    </div>
  );
});

export default function ArticleList({ articles }: { articles: Article[] }) {
  const listRef = useListRef(null);
  const rowData = useMemo(() => ({ articles }), [articles]);

  return (
    <div className="h-full" style={{ minHeight: 0 }}>
      <List
        listRef={listRef}
        rowComponent={ArticleRow}
        rowCount={articles.length}
        rowHeight={120}
        rowProps={rowData}
        overscanCount={3}
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
}
```

### 7.3 配合 React Query 实现

```tsx
import { useQuery } from '@tanstack/react-query';
import { List, type RowComponentProps, useListRef } from 'react-window';
import { fetchTrendingRepos } from '@/api/articleApi';

interface RowProps {
  repos: Repo[];
}

export default function TrendingList() {
  const { data: repos, isLoading, error } = useQuery({
    queryKey: ['trendingRepos'],
    queryFn: fetchTrendingRepos,
    staleTime: 30 * 60 * 1000,
  });

  const listRef = useListRef(null);

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>加载失败</div>;
  if (!repos?.length) return <div>暂无数据</div>;

  return (
    <div style={{ height: 'calc(100vh - 100px)', width: '100%' }}>
      <List
        listRef={listRef}
        rowComponent={({ index, style, repos }: RowComponentProps<RowProps>) => (
          <RepoItem repo={repos[index]} style={style} />
        )}
        rowCount={repos.length}
        rowHeight={140}
        rowProps={{ repos }}
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
}
```

---

## 🎯 八、面试要点

### 8.1 必背问题

#### Q1：react-window 的核心原理是什么？

```
核心原理：
1. 只渲染可视区域内的元素（通常 10-20 个）
2. 使用 transform 定位实现滚动效果
3. DOM 节点复用，避免频繁创建销毁

计算公式：
startIndex = Math.floor(scrollTop / rowHeight)
endIndex = startIndex + Math.ceil(containerHeight / rowHeight)
```

#### Q2：react-window v1 和 v2 有什么区别？

```
v1 API（已过时）：
- 组件：FixedSizeList, VariableSizeList
- 属性：height, width, itemCount, itemSize
- 渲染：children render prop
- 数据：itemData

v2 API（当前）：
- 组件：List, Grid（统一）
- 属性：rowCount, rowHeight，尺寸由父容器控制
- 渲染：rowComponent prop
- 数据：rowProps

v2 主要变化：
- API 统一：不再区分 Fixed/Variable
- 尺寸控制：移除 height/width props，改用父容器
- 组件分离：rowComponent 替代 children
```

#### Q3：为什么要在行组件外层包裹 memo？

```
react-window 通过 React 的渲染机制判断是否需要更新行组件。
如果行组件是普通函数，每次父组件渲染都会创建新的函数引用，
导致 React 认为行组件变化，触发不必要的重渲染。

使用 memo 可以：
1. 避免未变化的行重新渲染
2. 保持列表滚动流畅
3. 减少 CPU 占用
```

### 8.2 进阶追问

#### Q4：如何处理动态高度的列表项？

```
方案一：预估高度 + 实测修正
- 初始使用预估高度进行定位
- 元素渲染后获取实际高度（useLayoutEffect + ref）
- 更新缓存，触发重新计算

方案二：二分查找优化
- 维护高度前缀和数组
- 使用二分查找快速定位 startIndex
- 时间复杂度从 O(n) 降到 O(log n)
```

#### Q5：快速滚动出现白屏怎么解决？

```
1. 增加 overscanCount（3-5），提前渲染更多行
2. 简化行组件，减少单行渲染时间
3. 使用骨架屏占位，提升视觉体验
4. 使用 requestAnimationFrame 优化滚动事件
5. 考虑预渲染下一屏内容
```

---

## 📚 九、参考资源

### 官方资源

| 资源 | 链接 |
|------|------|
| 官方文档 | https://react-window.vercel.app/ |
| GitHub 仓库 | https://github.com/bvaughn/react-window |
| v1 文档 | https://react-window-v1.vercel.app/ |

### 相关库

| 库 | 用途 |
|------|------|
| react-virtualized-auto-sizer | 自动适配容器尺寸 |
| react-window-infinite-loader | 无限滚动加载 |
| react-virtuoso | 功能更丰富的虚拟列表库 |

### 学习建议

1. **先理解原理**：阅读虚拟列表原理文章，手写简单实现
2. **再学 API**：跑通官方示例，理解各个 props 的作用
3. **最后实践**：在项目中应用，解决实际问题
4. **面试准备**：能够手写核心计算公式，解释性能优势

---

## 📋 附录：v1 vs v2 迁移指南

如果你之前使用过 v1，以下是迁移对照表：

```tsx
// ==================== v1 写法 ====================
import { FixedSizeList as List } from 'react-window';

<List
  height={400}
  width="100%"
  itemCount={items.length}
  itemSize={50}
  itemData={items}
>
  {({ index, style, data }) => (
    <div style={style}>{data[index]}</div>
  )}
</List>

// ==================== v2 写法 ====================
import { List, type RowComponentProps } from 'react-window';

interface RowProps { items: string[]; }

// ⚠️ 注意：直接解构 items，不是 rowProps.items
const Row = ({ index, style, items }: RowComponentProps<RowProps>) => (
  <div style={style}>{items[index]}</div>
);

<div style={{ height: 400, width: '100%' }}>
  <List
    rowComponent={Row}
    rowCount={items.length}
    rowHeight={50}
    rowProps={{ items }}
    style={{ height: '100%', width: '100%' }}
  />
</div>
```

### 属性对照表

| v1 | v2 | 说明 |
|----|-----|------|
| `height={400}` | 父容器设置高度 | v2 移除此 prop |
| `width="100%"` | 父容器设置宽度 | v2 移除此 prop |
| `itemCount` | `rowCount` | 属性重命名 |
| `itemSize` | `rowHeight` | 属性重命名 |
| `itemData` | `rowProps` | 属性重命名 |
| `children` render prop | `rowComponent` prop | 渲染方式变更 |
| `onItemsRendered` | `onRowsRendered` | 回调重命名 |

---

> **文档版本**：v2.1
> 
> **更新时间**：2026-03-23
> 
> **修正内容**：修正 `rowProps` 的正确用法（属性直接展开到组件 props 中，不是嵌套对象）