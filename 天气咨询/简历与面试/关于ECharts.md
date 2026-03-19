# ECharts 天气项目实战指南

> 本文档为天气咨询项目量身定制，教你从零开始使用 ECharts 实现温度曲线图、湿度柱状图等数据可视化。

---

## 📚 一、ECharts 是什么？

### 1.1 核心概念

**ECharts** 是百度开源的数据可视化库，用于在网页中创建交互式图表。

**核心原理**：

```
数据 + 配置 = 图表
     ↓
  option 对象
```

**你只需要做两件事**：

1. 准备数据（从 API 获取）
2. 写一个 `option` 配置对象

ECharts 会自动渲染图表，处理交互、动画、缩放等功能。

### 1.2 为什么选择 ECharts？

| 优势     | 说明                                      |
| -------- | ----------------------------------------- |
| 类型丰富 | 折线图、柱状图、饼图、地图等 20+ 图表类型 |
| 配置简单 | 通过 `option` 对象配置，无需手动绘制      |
| 交互丰富 | 内置 tooltip、缩放、数据区域选择等        |
| 中文文档 | 官方中文文档完善，社区活跃                |
| 面试常见 | 数据可视化是前端必备技能                  |

---

## 🔧 二、安装与配置

### 2.1 安装命令

```bash
npm install echarts echarts-for-react
```

**包说明**：

| 包名                | 作用           | 必须安装？ |
| ------------------- | -------------- | ---------- |
| `echarts`           | ECharts 核心库 | ✅ 必须    |
| `echarts-for-react` | React 封装组件 | ✅ 推荐    |

**为什么用 echarts-for-react？**

| 方式              | 代码量                         | 响应式     | 推荐度     |
| ----------------- | ------------------------------ | ---------- | ---------- |
| 原生 echarts      | 多（需手动初始化、销毁、监听） | 需自己处理 | ⭐⭐       |
| echarts-for-react | 少（封装了生命周期）           | 自动响应   | ⭐⭐⭐⭐⭐ |

### 2.2 基本使用

```tsx
// 1. 导入组件
import ReactECharts from 'echarts-for-react'

// 2. 定义配置
const option = {
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [23, 24, 18, 25, 28, 30, 27],
    type: 'line'
  }]
}

// 3. 渲染图表
<ReactECharts option={option} style={{ height: 300 }} />
```

**三步流程**：

```
导入组件 → 定义 option → 渲染 <ReactECharts />
```

---

## 📊 三、核心配置对象 option

### 3.1 option 结构概览

```tsx
const option = {
  // 1. 标题
  title: { text: '图表标题' },

  // 2. 提示框（鼠标悬停显示）
  tooltip: { trigger: 'axis' },

  // 3. 图例（用于区分多条数据线）
  legend: { data: ['最高温', '最低温'] },

  // 4. X 轴
  xAxis: {
    type: 'category',  // 类目轴，用于离散数据
    data: ['周一', '周二', ...]
  },

  // 5. Y 轴
  yAxis: {
    type: 'value'  // 数值轴，用于连续数据
  },

  // 6. 系列数据（图表主体）
  series: [
    { name: '最高温', type: 'line', data: [...] },
    { name: '最低温', type: 'line', data: [...] }
  ],

  // 7. 图表区域（可选，调整边距）
  grid: { top: 30, right: 20, bottom: 30, left: 40 }
}
```

### 3.2 关键配置项详解

#### xAxis（X 轴）

```tsx
xAxis: {
  type: 'category',        // 'category' = 类目轴（周一、周二...）
                           // 'value' = 数值轴
                           // 'time' = 时间轴
                           // 'log' = 对数轴

  data: ['周一', '周二', '周三'],  // 类目数据

  axisLabel: {
    rotate: 45,            // 标签旋转角度
    color: '#666'          // 标签颜色
  },

  axisLine: {
    lineStyle: { color: '#ccc' }  // 轴线样式
  }
}
```

#### yAxis（Y 轴）

```tsx
yAxis: {
  type: 'value',           // 数值轴

  name: '温度(°C)',        // 轴名称
  nameLocation: 'end',     // 名称位置

  axisLabel: {
    formatter: '{value}°C'  // 标签格式化
  },

  splitLine: {
    lineStyle: { type: 'dashed' }  // 分隔线样式
  }
}
```

#### series（系列数据）

```tsx
series: [
  {
    name: '最高温', // 系列名称（显示在图例和 tooltip）
    type: 'line', // 图表类型：line/bar/pie/scatter...
    data: [28, 30, 25, 27], // 数据数组

    // 折线图特有配置
    smooth: true, // 平滑曲线
    symbol: 'circle', // 标记点形状
    symbolSize: 6, // 标记点大小
    lineStyle: {
      width: 2,
      color: '#5470c6',
    },
    itemStyle: {
      color: '#5470c6', // 标记点颜色
    },
    areaStyle: {
      // 填充区域
      color: 'rgba(84, 112, 198, 0.3)',
    },
  },
]
```

#### tooltip（提示框）

```tsx
tooltip: {
  trigger: 'axis',         // 'item' = 鼠标移到数据项触发
                           // 'axis' = 鼠标移到轴触发（推荐折线图）

  formatter: '{b}<br/>{a}: {c}°C',  // 自定义格式
  // {a} = 系列名称
  // {b} = 数据名（X轴类目）
  // {c} = 数据值

  backgroundColor: 'rgba(50,50,50,0.7)',
  borderColor: '#333',
  textStyle: { color: '#fff' }
}
```

---

## 🌡️ 四、天气项目实战：温度曲线图

### 4.1 需求分析

**目标**：展示未来 7 天的最高温度和最低温度曲线

**数据来源**：`useWeatherDailyData` 返回的 `WeatherDaily[]`

```tsx
// 数据结构（来自 qweather.ts）
interface WeatherDaily {
  fxDate: string // 日期 '2026-03-19'
  tempMax: string // 最高温度 '25'
  tempMin: string // 最低温度 '18'
  // ...其他字段
}
```

### 4.2 完整实现代码

```tsx
// src/components/TemperatureChart.tsx
import ReactECharts from 'echarts-for-react'
import { useWeatherDailyData } from '../hooks/useWeatherDailyData'
import { useLocationStore } from '../hooks/useLocationStore'

export default function TemperatureChart() {
  // 获取经纬度
  const location = useLocationStore(state => state.location)
  const { lon, lat } = location

  // 获取七日天气数据
  const { data: weatherDaily, isLoading } = useWeatherDailyData(lon, lat)

  // Loading 状态
  if (isLoading) {
    return <div className="text-center py-4">图表加载中...</div>
  }

  // 处理数据
  const daily = weatherDaily?.daily || []

  // X 轴日期数据
  const dates = daily.map(d => {
    // '2026-03-19' → '03/19'
    return d.fxDate.slice(5).replace('-', '/')
  })

  // 最高温度数据
  const maxTemps = daily.map(d => parseInt(d.tempMax))

  // 最低温度数据
  const minTemps = daily.map(d => parseInt(d.tempMin))

  // 配置对象
  const option = {
    title: {
      text: '七日温度趋势',
      left: 'center',
      textStyle: {
        fontSize: 16,
        color: '#333',
      },
    },

    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        // params 是数组，包含多条数据线的信息
        let result = params[0].axisValue + '<br/>'
        params.forEach((item: any) => {
          result += `${item.marker} ${item.seriesName}: ${item.value}°C<br/>`
        })
        return result
      },
    },

    legend: {
      data: ['最高温', '最低温'],
      bottom: 0,
    },

    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        color: '#666',
      },
    },

    yAxis: {
      type: 'value',
      name: '温度(°C)',
      axisLabel: {
        formatter: '{value}°C',
      },
    },

    series: [
      {
        name: '最高温',
        type: 'line',
        data: maxTemps,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#ee6666', width: 2 },
        itemStyle: { color: '#ee6666' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(238, 102, 102, 0.5)' },
              { offset: 1, color: 'rgba(238, 102, 102, 0.1)' },
            ],
          },
        },
      },
      {
        name: '最低温',
        type: 'line',
        data: minTemps,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#5470c6', width: 2 },
        itemStyle: { color: '#5470c6' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(84, 112, 198, 0.5)' },
              { offset: 1, color: 'rgba(84, 112, 198, 0.1)' },
            ],
          },
        },
      },
    ],

    grid: {
      top: 50,
      right: 20,
      bottom: 40,
      left: 50,
    },
  }

  return (
    <div className="temperature-chart">
      <ReactECharts option={option} style={{ height: 250 }} />
    </div>
  )
}
```

### 4.3 代码解析

**数据转换流程**：

```
API 返回数据:
[
  { fxDate: '2026-03-19', tempMax: '25', tempMin: '18' },
  { fxDate: '2026-03-20', tempMax: '27', tempMin: '20' },
  ...
]

        ↓ 处理后

X 轴数据: ['03/19', '03/20', ...]
最高温: [25, 27, ...]
最低温: [18, 20, ...]
```

**关键代码解读**：

```tsx
// 日期格式化
const dates = daily.map(d => d.fxDate.slice(5).replace('-', '/'))
// '2026-03-19'.slice(5) = '03-19'
// '03-19'.replace('-', '/') = '03/19'

// 字符串转数字
const maxTemps = daily.map(d => parseInt(d.tempMax))
// API 返回的是字符串 '25'，需要转成数字 25
```

---

## 💧 五、天气项目实战：湿度柱状图

### 5.1 需求分析

**目标**：展示未来 7 天的相对湿度

**数据来源**：`WeatherDaily` 中的 `humidity` 字段

### 5.2 完整实现代码

```tsx
// src/components/HumidityChart.tsx
import ReactECharts from 'echarts-for-react'
import { useWeatherDailyData } from '../hooks/useWeatherDailyData'
import { useLocationStore } from '../hooks/useLocationStore'

export default function HumidityChart() {
  const location = useLocationStore(state => state.location)
  const { lon, lat } = location
  const { data: weatherDaily, isLoading } = useWeatherDailyData(lon, lat)

  if (isLoading) {
    return <div className="text-center py-4">图表加载中...</div>
  }

  const daily = weatherDaily?.daily || []

  const dates = daily.map(d => d.fxDate.slice(5).replace('-', '/'))
  const humidity = daily.map(d => parseInt(d.humidity))

  const option = {
    title: {
      text: '七日湿度',
      left: 'center',
      textStyle: { fontSize: 16, color: '#333' },
    },

    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>湿度: {c}%',
    },

    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: { color: '#666' },
    },

    yAxis: {
      type: 'value',
      name: '湿度(%)',
      max: 100, // 最大值 100%
      axisLabel: {
        formatter: '{value}%',
      },
    },

    series: [
      {
        name: '湿度',
        type: 'bar',
        data: humidity,

        // 柱子样式
        barWidth: '40%', // 柱子宽度
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#73c0de' },
              { offset: 1, color: '#3ba272' },
            ],
          },
          borderRadius: [4, 4, 0, 0], // 圆角 [上右下左]
        },

        // 显示数值标签
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
          color: '#666',
        },
      },
    ],

    grid: {
      top: 50,
      right: 20,
      bottom: 30,
      left: 50,
    },
  }

  return (
    <div className="humidity-chart">
      <ReactECharts option={option} style={{ height: 200 }} />
    </div>
  )
}
```

### 5.3 柱状图 vs 折线图配置差异

| 配置项                   | 折线图      | 柱状图                |
| ------------------------ | ----------- | --------------------- |
| `type`                   | `'line'`    | `'bar'`               |
| `smooth`                 | ✅ 平滑曲线 | ❌ 无效               |
| `symbol`                 | ✅ 标记点   | ❌ 无效               |
| `barWidth`               | ❌ 无效     | ✅ 柱子宽度           |
| `itemStyle.borderRadius` | ❌ 无效     | ✅ 柱子圆角           |
| `label.position`         | `'top'`     | `'top'` 或 `'inside'` |

---

## 🎨 六、图表样式美化

### 6.1 颜色配置

```tsx
// 方式1：直接指定颜色
itemStyle: { color: '#ee6666' }

// 方式2：渐变色
itemStyle: {
  color: {
    type: 'linear',      // 线性渐变
    x: 0, y: 0,          // 起点坐标（左上）
    x2: 0, y2: 1,        // 终点坐标（左下）
    colorStops: [
      { offset: 0, color: '#ee6666' },   // 0% 位置的颜色
      { offset: 1, color: '#fac858' }    // 100% 位置的颜色
    ]
  }
}
```

### 6.2 常用颜色方案

```tsx
// 天气项目推荐配色
const weatherColors = {
  tempMax: '#ee6666', // 红色 - 最高温
  tempMin: '#5470c6', // 蓝色 - 最低温
  humidity: '#73c0de', // 浅蓝 - 湿度
  wind: '#91cc75', // 绿色 - 风速
  rain: '#fac858', // 黄色 - 降水
}
```

### 6.3 响应式图表

```tsx
// 自动适应容器大小
<ReactECharts
  option={option}
  style={{ height: 300, width: '100%' }}
  opts={{ renderer: 'canvas' }} // canvas 渲染，性能更好
/>
```

---

## 🔗 七、集成到项目

### 7.1 在 LeftContainer 中使用

```tsx
// src/components/LeftContainer.tsx
import TodaySWeather from './TodaySWeather'
import SevenDayWeather from './SevenDayWeather'
import TemperatureChart from './TemperatureChart'
import HumidityChart from './HumidityChart'
import ErrorBoundary from './ErrorBoundary'
import '../css/LeftContainer.css'

export default function LeftContainer() {
  return (
    <div className="left-container">
      <ErrorBoundary>
        <TodaySWeather />
      </ErrorBoundary>
      <ErrorBoundary>
        <SevenDayWeather />
      </ErrorBoundary>

      {/* 新增图表组件 */}
      <ErrorBoundary>
        <TemperatureChart />
      </ErrorBoundary>
      <ErrorBoundary>
        <HumidityChart />
      </ErrorBoundary>
    </div>
  )
}
```

### 7.2 使用 ErrorBoundary 包裹

**为什么需要 ErrorBoundary？**

图表组件可能因为以下原因崩溃：

- 数据格式错误
- ECharts 初始化失败
- 空数据处理不当

使用 ErrorBoundary 可以防止图表崩溃影响整个页面。

---

## ❓ 八、面试常见问题

### 8.1 基础问题

**Q1：ECharts 的核心概念是什么？**

```
ECharts 采用"数据驱动"的设计理念：
- 数据：要展示的数据数组
- 配置：option 对象，定义图表类型、样式、交互
- 渲染：ECharts 自动将数据和配置转换为可视化图表
```

**Q2：option 对象的主要属性有哪些？**

| 属性      | 作用                   |
| --------- | ---------------------- |
| `title`   | 图表标题               |
| `tooltip` | 提示框配置             |
| `legend`  | 图例（区分多系列数据） |
| `xAxis`   | X 轴配置               |
| `yAxis`   | Y 轴配置               |
| `series`  | 数据系列（图表主体）   |
| `grid`    | 图表区域（边距）       |

**Q3：series 中的 type 有哪些常用值？**

```
- 'line'    折线图
- 'bar'     柱状图
- 'pie'     饼图
- 'scatter' 散点图
- 'radar'   雷达图
- 'map'     地图
```

### 8.2 进阶问题

**Q4：如何在 React 中使用 ECharts？**

```tsx
// 方式1：原生 echarts（不推荐）
import * as echarts from 'echarts'
useEffect(() => {
  const chart = echarts.init(document.getElementById('chart'))
  chart.setOption(option)
  return () => chart.dispose() // 清理
}, [])

// 方式2：echarts-for-react（推荐）
import ReactECharts from 'echarts-for-react'
;<ReactECharts option={option} />
// 自动处理生命周期、响应式更新
```

**Q5：如何实现多条折线？**

```tsx
series: [
  { name: '最高温', type: 'line', data: [25, 27, 28] },
  { name: '最低温', type: 'line', data: [18, 20, 19] },
]
// 两条线会自动使用不同颜色，图例会显示两个系列
```

**Q6：如何优化大数据量图表的性能？**

```tsx
// 1. 使用 dataZoom 实现数据缩放
dataZoom: [{
  type: 'slider',    // 滑动条缩放
  start: 0,          // 初始位置
  end: 50            // 结束位置（只显示50%数据）
}]

// 2. 关闭动画
animation: false

// 3. 减少数据点
large: true,         // 开启大数据优化
largeThreshold: 2000 // 数据量超过2000时启用优化

// 4. 使用 SVG 渲染（适合少量数据）
<ReactECharts opts={{ renderer: 'svg' }} />
```

**Q7：tooltip 的 trigger 有什么区别？**

```tsx
tooltip: {
  trigger: 'item' // 鼠标移到数据点触发（适合饼图、散点图）
}

tooltip: {
  trigger: 'axis' // 鼠标移到轴触发（适合折线图、柱状图）
}
```

### 8.3 项目实战问题

**Q8：你在项目中如何使用 ECharts 的？**

```
在天气咨询项目中，我使用 ECharts 展示七日温度趋势和湿度变化：

1. 安装 echarts 和 echarts-for-react
2. 创建 TemperatureChart 组件
3. 从 useWeatherDailyData 获取七日天气数据
4. 将 API 返回的字符串数据转换为数字数组
5. 配置 option 对象，包含 xAxis、yAxis、series
6. 使用 <ReactECharts option={option} /> 渲染图表
7. 用 ErrorBoundary 包裹，防止图表崩溃影响页面

关键点：
- 数据需要预处理（字符串→数字，日期格式化）
- 使用 smooth: true 实现平滑曲线
- 使用 areaStyle 添加填充效果
- 使用 legend 区分多条数据线
```

**Q9：数据更新后图表如何响应？**

```tsx
// echarts-for-react 自动响应 option 变化
const [data, setData] = useState([])

const option = {
  series: [{ type: 'line', data }]  // 使用 state 数据
}

// 当 data 变化时，图表自动更新
<ReactECharts option={option} />
```

---

## 📝 九、速查表

### 9.1 安装命令

```bash
npm install echarts echarts-for-react
```

### 9.2 最小可用示例

```tsx
import ReactECharts from 'echarts-for-react'

const option = {
  xAxis: { type: 'category', data: ['A', 'B', 'C'] },
  yAxis: { type: 'value' },
  series: [{ type: 'line', data: [10, 20, 30] }]
}

<ReactECharts option={option} style={{ height: 300 }} />
```

### 9.3 常用配置速查

```tsx
// 折线图
series: [{
  type: 'line',
  smooth: true,        // 平滑
  symbol: 'circle',    // 标记点
  areaStyle: {}        // 填充
}]

// 柱状图
series: [{
  type: 'bar',
  barWidth: '40%',     // 宽度
  itemStyle: { borderRadius: [4, 4, 0, 0] }  // 圆角
}]

// 提示框
tooltip: { trigger: 'axis' }

// 图例
legend: { data: ['系列1', '系列2'], bottom: 0 }

// 标题
title: { text: '标题', left: 'center' }
```

---

## 🚀 十、下一步建议

1. **完成图表组件**：创建 `TemperatureChart.tsx` 和 `HumidityChart.tsx`
2. **集成到项目**：在 `LeftContainer` 中引入图表组件
3. **样式调整**：根据项目风格调整图表颜色和布局
4. **添加更多图表**：风速柱状图、降水面积图等

---

**文档版本**：v1.0  
**创建时间**：2026-03-19  
**适用项目**：天气咨询应用
