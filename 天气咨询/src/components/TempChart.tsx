import EChartsReact from "echarts-for-react";
import { useThemeStore } from "../hooks/useThemeStore";

type Props = {
    maxTemp: string[] | null,
    minTemp: string[] | null,
    time: string[]
}
export default function TempChart({maxTemp, minTemp, time}: Props){
    const theme = useThemeStore(state => state.theme)
    const isDark = theme === 'dark'

    const option = {
            title: {
                text: '七日温度趋势表',
                textStyle: {
                    color: isDark ? '#e5e7eb' : '#1f2937',  // 标题颜色
                    fontSize: 18,
                    fontWeight: 600
                }
            },
            toolbox: {
                show: true,
                feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                magicType: { type: ['line', 'bar'] },
                saveAsImage: {}
                }
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                textStyle: { color: isDark ? '#f3f4f6' : '#1f2937' }
            },
            legend: { top:35, textStyle:{color: isDark ? '#ffffff' : '#000000'}},
            grid: {
                top: 80
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: time,
                axisLine: { lineStyle: { color: isDark ? '#ffffff' : '#000000' } },
                axisLabel: { color: isDark ? '#ffffff' : '#000000' }
            },
            yAxis: {
                type: 'value',
                scale: true,
                axisLine: { lineStyle: { color: isDark ? '#ffffff' : '#000000' } },
                axisLabel: {
                    color: isDark ? '#ffffff' : '#000000',
                    formatter: '{value} °C'
                }
            },
            series: [
                {
                name: '最高气温',
                type: 'line',
                smooth: true,
                data: maxTemp,
                color: isDark ? '#f87171' : '#ef4444',
                markLine: {
                    data: [{ type: 'average', name: 'Avg' }],
                    lineStyle: { color: isDark ? '#fbbf24' : '#f59e0b' }
                }
                },
                {
                name: '最低气温',
                type: 'line',
                smooth: true,
                data: minTemp,
                color: isDark ? '#60a5fa' : '#3b82f6',
                markPoint: {
                    data: [{ name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }]
                },
                markLine: {
                    data: [{ type: 'average', name: '平均' }],
                    lineStyle: { color: isDark ? '#34d399' : '#10b981' }
                }
                }
            ]
        };

    return <EChartsReact option={option} style={{ height: '100%' }}/>
}