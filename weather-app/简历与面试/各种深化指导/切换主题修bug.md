# 切换主题功能 Bug 修复文档

> 本文档记录主题切换功能开发过程中遇到的问题及解决方案
>
> **项目路径**: `D:\Code\react框架练习\天气咨询`
> **创建日期**: 2026-03-18

---

## 一、问题描述

### 1.1 预期效果

点击主题切换按钮后：

- 页面背景从深色变为浅色（或相反）
- 所有组件的颜色、背景、边框自动适配新主题
- 刷新页面后保持用户选择的主题

### 1.2 实际效果

点击主题切换按钮后：

- ❌ 页面背景没有变化
- ❌ 按钮样式异常（显示高亮灰色）
- ❌ 文字在某些情况下"消失"
- ❌ 组件样式完全没有响应主题切换

---

## 二、问题分析

### 2.1 整体架构检查

首先验证主题切换的完整链路：

```
用户点击按钮
    ↓
Zustand Store 更新 theme 状态
    ↓
useEffect 监听 theme 变化
    ↓
document.documentElement.classList.add('dark')
    ↓
<html class="dark">
    ↓
Tailwind dark: 前缀样式生效
    ↓
页面样式变化
```

### 2.2 逐层排查

#### 第一层：状态管理 ✅ 正常

**文件**: `src/hooks/useThemeStore.tsx`

```tsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeStore {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    set => ({
      theme: 'light',
      toggleTheme: () => {
        set(state => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        }))
      },
      setTheme: theme => set({ theme }),
    }),
    { name: 'theme-storage' }
  )
)
```

**检查结果**：

- ✅ Zustand store 正确定义
- ✅ persist 中间件正确配置
- ✅ toggleTheme 函数逻辑正确

#### 第二层：DOM 同步 ✅ 正常

**文件**: `src/components/WeatherApp.tsx` (第39-49行)

```tsx
const theme = useThemeStore(state => state.theme)

// 监听theme状态,第一次加载时同步主题到 DOM
useEffect(() => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}, [theme])
```

**检查结果**：

- ✅ 正确监听 theme 变化
- ✅ 正确操作 DOM class
- ✅ 依赖数组正确 `[theme]`

#### 第三层：CSS 样式 ❌ 问题所在

通过代码审查发现，多个 CSS 文件写死了深色背景。

---

## 三、问题根因：CSS 文件详细清单

### 3.1 TopContainer.css

**文件路径**: `src/css/TopContainer.css`

| 行号    | 选择器                   | 问题代码                                    | 影响                 |
| ------- | ------------------------ | ------------------------------------------- | -------------------- |
| 62-63   | `.city-input:focus`      | `background-color: rgba(20, 20, 20, 0.9);`  | 输入框聚焦时深色背景 |
| 82      | `.positioning-btn`       | `background-color: rgba(41, 41, 236, 0.8);` | 定位按钮背景色       |
| 83      | `.positioning-btn`       | `border: 5px solid rgba(85, 85, 255, 0.6);` | 定位按钮边框         |
| 104     | `.positioning-btn:hover` | `background-color: rgba(85, 85, 255, 0.9);` | 悬停背景             |
| 318     | `.suggestions-list`      | `background: rgba(0, 0, 0, 0.781);`         | 搜索建议列表背景     |
| 333     | `.suggestion-item:hover` | `background: #ffffff69;`                    | 建议项悬停背景       |
| 341-346 | 滚动条样式               | `#00000080`, `#000000bd`                    | 滚动条颜色           |

**问题代码示例** (第61-65行):

```css
.city-input:focus {
  border-color: rgba(85, 85, 255, 0.8);
  background-color: rgba(20, 20, 20, 0.9); /* ❌ 写死深色背景 */
  box-shadow: 0 0 15px rgba(85, 85, 255, 0.3);
}
```

---

### 3.2 SevenDayWeather.css

**文件路径**: `src/css/SevenDayWeather.css`

| 行号 | 选择器                                        | 问题代码                                                                             | 影响           |
| ---- | --------------------------------------------- | ------------------------------------------------------------------------------------ | -------------- |
| 6    | `.seven-day-weather`                          | `background: linear-gradient(135deg, rgba(60, 60, 60, 0.9), rgba(40, 40, 40, 0.9));` | 主容器渐变背景 |
| 52   | `.seven-day-weather-content-item`             | `background: rgba(255, 255, 255, 0.05);`                                             | 列表项背景     |
| 61   | `.seven-day-weather-content-item:hover`       | `background: rgba(255, 255, 255, 0.1);`                                              | 列表项悬停背景 |
| 93   | `.seven-day-weather-content-item:first-child` | `background: rgba(255, 255, 255, 0.15);`                                             | 第一项背景     |

**问题代码示例** (第1-13行):

```css
.seven-day-weather {
  width: 95%;
  height: 55%;
  border-radius: 20px;
  background: linear-gradient(
    135deg,
    rgba(60, 60, 60, 0.9),
    rgba(40, 40, 40, 0.9)
  ); /* ❌ 写死渐变 */
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  /* ... */
}
```

---

### 3.3 RealTimeCard.css

**文件路径**: `src/css/RealTimeCard.css`

| 行号 | 选择器            | 问题代码                             | 影响     |
| ---- | ----------------- | ------------------------------------ | -------- |
| 10   | `.real-time-card` | `background: rgba(60, 60, 60, 0.9);` | 卡片背景 |

**问题代码示例** (第1-22行):

```css
.real-time-card {
  border: 1px solid rgba(255, 255, 255, 0.15);
  /* ... */
  background: rgba(60, 60, 60, 0.9); /* ❌ 写死深色背景 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  /* ... */
}
```

---

### 3.4 SunriseAndMoonriseTimes.css

**文件路径**: `src/css/SunriseAndMoonriseTimes.css`

| 行号 | 选择器                        | 问题代码                                                                             | 影响             |
| ---- | ----------------------------- | ------------------------------------------------------------------------------------ | ---------------- |
| 11   | `.sunrise-and-moonrise-times` | `background: linear-gradient(135deg, rgba(60, 60, 60, 0.9), rgba(40, 40, 40, 0.9));` | 主容器渐变背景   |
| 38   | `.time-div`                   | `background: rgba(255, 255, 255, 0.05);`                                             | 时间容器背景     |
| 51   | `.time-div:hover`             | `background: rgba(255, 255, 255, 0.08);`                                             | 时间容器悬停背景 |

**问题代码示例** (第5-18行):

```css
.sunrise-and-moonrise-times {
  border-radius: 15px;
  padding: 15px;
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
  background: linear-gradient(
    135deg,
    rgba(60, 60, 60, 0.9),
    rgba(40, 40, 40, 0.9)
  ); /* ❌ 写死渐变 */
  backdrop-filter: blur(10px);
  /* ... */
}
```

---

### 3.5 WindDirectionAndAirData.css

**文件路径**: `src/css/WindDirectionAndAirData.css`

| 行号 | 选择器                         | 问题代码                                                                             | 影响                     |
| ---- | ------------------------------ | ------------------------------------------------------------------------------------ | ------------------------ |
| 9    | `.wind-direction-and-air-data` | `background: linear-gradient(135deg, rgba(60, 60, 60, 0.9), rgba(40, 40, 40, 0.9));` | 主容器渐变背景           |
| 32   | `.air-quality`                 | `background: rgba(255, 255, 255, 0.05);`                                             | 空气质量背景             |
| 39   | `.air-quality:hover`           | `background: rgba(255, 255, 255, 0.08);`                                             | 空气质量悬停背景         |
| 100  | `.pollutant-*:hover`           | `background: rgba(33, 149, 243, 0.1);`                                               | 污染物悬停背景           |
| 301  | `.pollutant-*`                 | `background: rgba(255, 255, 255, 0.03);`                                             | 污染物背景（手机端）     |
| 320  | `.pollutant-*:hover`           | `background: rgba(33, 149, 243, 0.15);`                                              | 污染物悬停背景（手机端） |

**问题代码示例** (第1-15行):

```css
.wind-direction-and-air-data {
  border-radius: 15px;
  padding: 5px;
  width: 50%;
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
  background: linear-gradient(
    135deg,
    rgba(60, 60, 60, 0.9),
    rgba(40, 40, 40, 0.9)
  ); /* ❌ 写死渐变 */
  /* ... */
}
```

---

### 3.6 WeatherDataCard.css

**文件路径**: `src/css/WeatherDataCard.css`

| 行号 | 选择器               | 问题代码                                                                             | 影响         |
| ---- | -------------------- | ------------------------------------------------------------------------------------ | ------------ |
| 4    | `.weather-data-card` | `background: linear-gradient(135deg, rgba(60, 60, 60, 0.9), rgba(40, 40, 40, 0.9));` | 卡片渐变背景 |

**问题代码示例** (第1-24行):

```css
.weather-data-card {
  border-radius: 15px;
  background: linear-gradient(
    135deg,
    rgba(60, 60, 60, 0.9),
    rgba(40, 40, 40, 0.9)
  ); /* ❌ 写死渐变 */
  width: 23%;
  height: 20vh;
  min-height: 140px;
  color: #ffffff;
  /* ... */
}
```

---

### 3.7 TodaySWeather.css

**文件路径**: `src/css/TodaySWeather.css`

| 行号 | 选择器  | 问题代码                                 | 影响                   |
| ---- | ------- | ---------------------------------------- | ---------------------- |
| 279  | `.city` | `background: rgba(255, 255, 255, 0.08);` | 城市名称背景（手机端） |

**注意**: 该文件大部分使用 Tailwind 类，CSS 中只有少量硬编码。

---

### 3.8 问题汇总表

| 文件                          | 写死背景色行数 | 主要问题                 | 严重程度 |
| ----------------------------- | -------------- | ------------------------ | -------- |
| `TopContainer.css`            | 6处            | 输入框、按钮、列表背景   | 🔴 高    |
| `SevenDayWeather.css`         | 4处            | 主容器渐变、列表项背景   | 🔴 高    |
| `RealTimeCard.css`            | 1处            | 卡片背景                 | 🟡 中    |
| `SunriseAndMoonriseTimes.css` | 3处            | 主容器渐变、时间容器背景 | 🟡 中    |
| `WindDirectionAndAirData.css` | 6处            | 主容器渐变、各项背景     | 🟡 中    |
| `WeatherDataCard.css`         | 1处            | 卡片渐变背景             | 🟡 中    |
| `TodaySWeather.css`           | 1处            | 城市名称背景（手机端）   | 🟢 低    |

---

## 四、其他发现的问题

### 4.1 Tailwind 类名拼写正确（已修复）

**文件**: `src/components/TopContainer.tsx` (第114-116行)

当前代码是正确的：

```tsx
className="city-input
  bg-white/60 text-black dark:bg-black/60 dark:text-white
  hover:border-white/60 hover:bg-neutral-800/80 hover:shadow-[0_4px_15px_rgba(0,0,0,0.5)]"
```

**注意**: 如果之前有拼写错误如 `dark:text-while`，需要改成 `dark:text-white`。

### 4.2 已使用的 Tailwind dark: 类

**文件**: `src/components/TopContainer.tsx`

```tsx
// 第107行 - 容器
<div className="top-container bg-white dark:bg-black">

// 第114-116行 - 输入框
className="city-input
  bg-white/60 text-black dark:bg-black/60 dark:text-white
  hover:border-white/60 ..."
```

**问题**: Tailwind 类正确设置了，但 CSS 文件中的写死样式优先级更高或覆盖了这些类。

---

## 五、CSS 优先级问题分析

### 5.1 为什么 CSS 覆盖了 Tailwind？

```css
/* Tailwind 生成的样式 */
.dark .top-container {
  background-color: black; /* Tailwind dark:bg-black */
}

/* 但 CSS 文件有更高优先级的选择器 */
.top-container {
  /* 没有直接设置，但如果子元素设置了 */
}

.seven-day-weather {
  background: linear-gradient(...); /* 直接写死，优先级高于 Tailwind */
}
```

**核心问题**:

- CSS 文件中直接写死的 `background` 样式不会响应 `html.dark` 类的变化
- Tailwind 的 `dark:` 前缀只在 `<html class="dark">` 时生效
- 但 CSS 文件的选择器没有检查 `html.dark`

### 5.2 解决方案：使用 CSS 变量

CSS 变量可以根据 `html.dark` 动态切换值：

```css
:root {
  --bg-card: rgba(255, 255, 255, 0.9); /* light 模式 */
}

html.dark {
  --bg-card: rgba(60, 60, 60, 0.9); /* dark 模式 */
}

/* 使用变量 */
.my-component {
  background: var(--bg-card); /* 自动响应主题 */
}
```

---

## 六、解决方案

### 6.1 方案选择

| 方案         | 优点                       | 缺点                     | 推荐度     |
| ------------ | -------------------------- | ------------------------ | ---------- |
| CSS 变量     | 改动小，兼容性好，精确控制 | 需要修改多个文件         | ⭐⭐⭐⭐⭐ |
| Tailwind 类  | 代码简洁，现代化           | 改动大，需要重写所有样式 | ⭐⭐⭐⭐   |
| CSS 媒体查询 | 跟随系统，无需手动控制     | 无法让用户手动选择主题   | ⭐⭐       |

**推荐使用 CSS 变量方案**，改动最小，风险最低。

### 6.2 CSS 变量方案实现

#### Step 1：定义全局 CSS 变量

在 `src/index.css` 中添加：

```css
@import 'tailwindcss';

/* ========================================
   主题变量定义
   ======================================== */

/* 日间模式（默认） */
:root {
  /* 主背景色 */
  --bg-primary: #f3f4f6;
  --bg-secondary: rgba(255, 255, 255, 0.8);
  --bg-card: rgba(255, 255, 255, 0.9);
  --bg-card-hover: rgba(255, 255, 255, 0.95);

  /* 渐变背景 */
  --bg-gradient-start: rgba(240, 240, 240, 0.9);
  --bg-gradient-end: rgba(220, 220, 220, 0.9);

  /* 列表项背景 */
  --bg-item: rgba(0, 0, 0, 0.03);
  --bg-item-hover: rgba(0, 0, 0, 0.05);
  --bg-item-active: rgba(0, 0, 0, 0.08);

  /* 文字颜色 */
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --text-muted: rgba(0, 0, 0, 0.6);

  /* 边框颜色 */
  --border-primary: rgba(0, 0, 0, 0.1);
  --border-secondary: rgba(0, 0, 0, 0.2);

  /* 阴影 */
  --shadow-primary: rgba(0, 0, 0, 0.1);
  --shadow-secondary: rgba(0, 0, 0, 0.15);

  /* 输入框背景 */
  --bg-input: rgba(255, 255, 255, 0.6);
  --bg-input-focus: rgba(255, 255, 255, 0.9);

  /* 按钮背景 */
  --bg-btn-primary: rgba(41, 41, 236, 0.8);
  --bg-btn-primary-hover: rgba(85, 85, 255, 0.9);
  --border-btn-primary: rgba(85, 85, 255, 0.6);
}

/* 夜间模式 */
html.dark {
  /* 主背景色 */
  --bg-primary: #121212;
  --bg-secondary: rgba(60, 60, 60, 0.8);
  --bg-card: rgba(60, 60, 60, 0.9);
  --bg-card-hover: rgba(70, 70, 70, 0.9);

  /* 渐变背景 */
  --bg-gradient-start: rgba(60, 60, 60, 0.9);
  --bg-gradient-end: rgba(40, 40, 40, 0.9);

  /* 列表项背景 */
  --bg-item: rgba(255, 255, 255, 0.05);
  --bg-item-hover: rgba(255, 255, 255, 0.08);
  --bg-item-active: rgba(255, 255, 255, 0.15);

  /* 文字颜色 */
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-muted: rgba(255, 255, 255, 0.6);

  /* 边框颜色 */
  --border-primary: rgba(255, 255, 255, 0.1);
  --border-secondary: rgba(255, 255, 255, 0.2);

  /* 阴影 */
  --shadow-primary: rgba(0, 0, 0, 0.3);
  --shadow-secondary: rgba(0, 0, 0, 0.4);

  /* 输入框背景 */
  --bg-input: rgba(0, 0, 0, 0.6);
  --bg-input-focus: rgba(20, 20, 20, 0.9);

  /* 按钮背景（夜间模式保持不变） */
  --bg-btn-primary: rgba(41, 41, 236, 0.8);
  --bg-btn-primary-hover: rgba(85, 85, 255, 0.9);
  --border-btn-primary: rgba(85, 85, 255, 0.6);
}

/* 平滑过渡 */
* {
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease;
}
```

#### Step 2：修改各 CSS 文件

**TopContainer.css** 修改：

```css
/* 第62-65行 修改前 */
.city-input:focus {
  border-color: rgba(85, 85, 255, 0.8);
  background-color: rgba(20, 20, 20, 0.9);
  box-shadow: 0 0 15px rgba(85, 85, 255, 0.3);
}

/* 第62-65行 修改后 */
.city-input:focus {
  border-color: rgba(85, 85, 255, 0.8);
  background-color: var(--bg-input-focus);
  box-shadow: 0 0 15px rgba(85, 85, 255, 0.3);
}

/* 第82-83行 修改前 */
background-color: rgba(41, 41, 236, 0.8);
border: 5px solid rgba(85, 85, 255, 0.6);

/* 第82-83行 修改后 */
background-color: var(--bg-btn-primary);
border: 5px solid var(--border-btn-primary);

/* 第104行 修改前 */
background-color: rgba(85, 85, 255, 0.9);

/* 第104行 修改后 */
background-color: var(--bg-btn-primary-hover);

/* 第318行 修改前 */
background: rgba(0, 0, 0, 0.781);

/* 第318行 修改后 */
background: var(--bg-card);
```

**SevenDayWeather.css** 修改：

```css
/* 第6行 修改前 */
background: linear-gradient(135deg, rgba(60, 60, 60, 0.9), rgba(40, 40, 40, 0.9));

/* 第6行 修改后 */
background: linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end));

/* 第52行 修改前 */
background: rgba(255, 255, 255, 0.05);

/* 第52行 修改后 */
background: var(--bg-item);

/* 第61行 修改前 */
background: rgba(255, 255, 255, 0.1);

/* 第61行 修改后 */
background: var(--bg-item-hover);

/* 第93行 修改前 */
background: rgba(255, 255, 255, 0.15);

/* 第93行 修改后 */
background: var(--bg-item-active);
```

**RealTimeCard.css** 修改：

```css
/* 第10行 修改前 */
background: rgba(60, 60, 60, 0.9);

/* 第10行 修改后 */
background: var(--bg-card);
```

**SunriseAndMoonriseTimes.css** 修改：

```css
/* 第11行 修改前 */
background: linear-gradient(135deg, rgba(60, 60, 60, 0.9), rgba(40, 40, 40, 0.9));

/* 第11行 修改后 */
background: linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end));

/* 第38行 修改前 */
background: rgba(255, 255, 255, 0.05);

/* 第38行 修改后 */
background: var(--bg-item);

/* 第51行 修改前 */
background: rgba(255, 255, 255, 0.08);

/* 第51行 修改后 */
background: var(--bg-item-hover);
```

**WindDirectionAndAirData.css** 修改：

```css
/* 第9行 修改前 */
background: linear-gradient(135deg, rgba(60, 60, 60, 0.9), rgba(40, 40, 40, 0.9));

/* 第9行 修改后 */
background: linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end));

/* 第32行 修改前 */
background: rgba(255, 255, 255, 0.05);

/* 第32行 修改后 */
background: var(--bg-item);

/* 第39行 修改前 */
background: rgba(255, 255, 255, 0.08);

/* 第39行 修改后 */
background: var(--bg-item-hover);

/* 第100行 修改前 */
background: rgba(33, 149, 243, 0.1);

/* 第100行 修改后 */
background: rgba(33, 149, 243, 0.1); /* 这个是蓝色高亮，可以保持不变 */

/* 第301行 修改前 */
background: rgba(255, 255, 255, 0.03);

/* 第301行 修改后 */
background: var(--bg-item);
```

**WeatherDataCard.css** 修改：

```css
/* 第4行 修改前 */
background: linear-gradient(135deg, rgba(60, 60, 60, 0.9), rgba(40, 40, 40, 0.9));

/* 第4行 修改后 */
background: linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end));
```

**TodaySWeather.css** 修改：

```css
/* 第279行 修改前 */
background: rgba(255, 255, 255, 0.08);

/* 第279行 修改后 */
background: var(--bg-item);
```

---

## 七、修改清单

### 7.1 必须修改的文件

| 文件                                  | 修改位置 | 修改内容          | 优先级 |
| ------------------------------------- | -------- | ----------------- | ------ |
| `src/index.css`                       | 新增     | 添加 CSS 变量定义 | 🔴 高  |
| `src/css/TopContainer.css`            | 6处      | 替换背景色为变量  | 🔴 高  |
| `src/css/SevenDayWeather.css`         | 4处      | 替换背景色为变量  | 🔴 高  |
| `src/css/RealTimeCard.css`            | 1处      | 替换背景色为变量  | 🟡 中  |
| `src/css/SunriseAndMoonriseTimes.css` | 3处      | 替换背景色为变量  | 🟡 中  |
| `src/css/WindDirectionAndAirData.css` | 4处      | 替换背景色为变量  | 🟡 中  |
| `src/css/WeatherDataCard.css`         | 1处      | 替换背景色为变量  | 🟡 中  |
| `src/css/TodaySWeather.css`           | 1处      | 替换背景色为变量  | 🟢 低  |

### 7.2 修改统计

- **总计**: 8个文件，21处修改
- **预计工作量**: 约1-2小时
- **风险等级**: 低（CSS 变量向后兼容）

---

## 八、测试验证

### 8.1 功能测试

| 测试项     | 操作                 | 预期结果                | 通过 |
| ---------- | -------------------- | ----------------------- | ---- |
| 主题切换   | 点击切换按钮         | 页面颜色整体变化        | ☐    |
| light 模式 | 切换到 light         | 白色/浅色背景，深色文字 | ☐    |
| dark 模式  | 切换到 dark          | 深色背景，浅色文字      | ☐    |
| 持久化     | 刷新页面             | 主题保持不变            | ☐    |
| 输入框     | 切换主题后聚焦输入框 | 背景色正确              | ☐    |
| 列表项     | 切换主题后悬停列表项 | 背景色正确              | ☐    |
| 按钮       | 切换主题后悬停按钮   | 背景色正确              | ☐    |

### 8.2 开发者工具验证

```html
<!-- light 模式 -->
<html lang="zh-CN">
  <!-- dark 模式 -->
  <html lang="zh-CN" class="dark"></html>
</html>
```

检查 CSS 变量是否正确应用：

```css
/* 在 Elements 面板中查看 Computed 样式 */
background-color: var(--bg-card);

/* 应该解析为：
   light 模式: rgba(255, 255, 255, 0.9)
   dark 模式: rgba(60, 60, 60, 0.9)
*/
```

### 8.3 回归测试

- [ ] 所有原有功能正常
- [ ] 响应式布局正常
- [ ] 动画效果正常
- [ ] 无控制台错误

---

## 九、经验总结

### 9.1 主题切换的正确姿势

```
1. 状态管理：Zustand + persist 中间件
2. DOM 同步：useEffect 监听状态变化
3. 样式控制：CSS 变量或 Tailwind dark: 前缀
4. 全局协调：所有层级都要响应主题变化
```

### 9.2 常见错误

| 错误                  | 后果               | 解决方案          |
| --------------------- | ------------------ | ----------------- |
| CSS 写死背景色        | 覆盖 Tailwind 样式 | 使用 CSS 变量     |
| Tailwind 类名拼写错误 | 样式无效           | 仔细检查拼写      |
| useEffect 缺少依赖    | 切换不生效         | 添加 theme 依赖   |
| Store 中操作 DOM      | 职责混乱           | 用 useEffect 处理 |

### 9.3 调试技巧

1. **检查 DOM**：打开开发者工具，确认 `<html>` 标签的 `dark` 类是否正确添加/移除
2. **检查 CSS 优先级**：使用开发者工具的 Styles 面板，查看哪个样式生效
3. **检查 CSS 变量**：在 Computed 面板中查看变量是否正确解析
4. **搜索写死的颜色**：使用 `grep -r "rgba\|rgb\|#[0-9a-f]" src/css/` 搜索硬编码的颜色

### 9.4 预防措施

1. **使用 CSS 变量**：从项目开始就使用 CSS 变量
2. **使用 Tailwind dark:**：优先使用 Tailwind 的主题支持
3. **代码审查**：检查新增的 CSS 是否有硬编码颜色
4. **自动化检查**：可以配置 Stylelint 规则检测硬编码颜色

---

## 十、扩展阅读

- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [CSS 变量完整指南](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)
- [Zustand Persist Middleware](https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md)

---

## 十一、修改记录

| 日期       | 修改内容                       | 修改人 |
| ---------- | ------------------------------ | ------ |
| 2026-03-18 | 创建文档，记录 Bug 分析过程    | -      |
| 2026-03-18 | 根据实际代码添加详细的问题清单 | -      |
| 2026-03-18 | 添加具体的 CSS 变量修改方案    | -      |
