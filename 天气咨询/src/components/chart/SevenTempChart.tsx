import EChartsReact from 'echarts-for-react'
import { useThemeStore } from '../../hooks/useThemeStore'
import type { TempChartProp } from '../../types/qweather'

type Props = {
  chartData: TempChartProp
}
export default function SevenTempChart({ chartData }: Props) {
  const theme = useThemeStore(state => state.theme)
  const isDark = theme === 'dark'
  const { title, time, data } = chartData

  const option = {
    title: {
      text: title,
      textStyle: {
        color: isDark ? '#e5e7eb' : '#1f2937', // 标题颜色
        fontSize: 18,
        fontWeight: 600,
      },
    },
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
        },
        magicType: { type: ['line', 'bar'] },
        saveAsImage: {},
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      textStyle: { color: isDark ? '#f3f4f6' : '#1f2937' },
    },
    legend: { top: 35, textStyle: { color: isDark ? '#ffffff' : '#000000' } },
    grid: {
      top: 80,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: time,
      axisLine: { lineStyle: { color: isDark ? '#ffffff' : '#000000' } },
      axisLabel: { color: isDark ? '#ffffff' : '#000000' },
    },
    yAxis: {
      type: 'value',
      scale: true,
      axisLine: { lineStyle: { color: isDark ? '#ffffff' : '#000000' } },
      boundaryGap: ['10%', '10%'],
      axisLabel: {
        color: isDark ? '#ffffff' : '#000000',
        formatter: '{value} °C',
      },
    },
    series: data.map(d => ({
      name: d.name,
      data: d.data,
      color: d.color,
      type: 'line',
      smooth: true,
      markLine: {
        data: [{ type: 'average', name: '平均' }],
        lineStyle: { color: isDark ? '#fbbf24' : '#f59e0b' },
      },
    })),
  }

  // notMerge={true} 告诉 ECharts 完全替换，不要合并数据
  // 不然切换两个表格的时候最低气温曲线会一直保留
  return <EChartsReact option={option} notMerge={true} style={{ height: '100%' }} />
}
