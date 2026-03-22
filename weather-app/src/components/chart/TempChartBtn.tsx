import { createPortal } from 'react-dom'
import SevenTempChart from './SevenTempChart.tsx'
import { useState } from 'react'
import { useLocationStore } from '../../hooks/useLocationStore.tsx'
import { useWeatherDailyData } from '../../hooks/useWeatherDailyData.tsx'
import { useWeatherHourly } from '../../hooks/useWeatherHourly.tsx'
export default function TempChartBtn() {
  const location = useLocationStore(state => state.location)
  const { data: weatherData } = useWeatherDailyData(location.lon, location.lat)
  const { data: hourlyWeatherData } = useWeatherHourly(location.lon, location.lat)
  const [show, setShow] = useState(false)
  const [isSevenDayData, setIsSevenDayData] = useState(true)

  const time = weatherData?.daily.map(data => data.fxDate) ?? []
  const maxTemp = weatherData?.daily.map(data => data.tempMax) ?? []
  const minTemp = weatherData?.daily.map(data => data.tempMin) ?? []
  const sevenDaydata = {
    title: '7日温度',
    time: time,
    data: [
      {
        name: '最高气温',
        data: maxTemp,
        color: '#ff4646',
      },
      {
        name: '最低气温',
        data: minTemp,
        color: '#4674ff',
      },
    ],
  }

  const hourlyTime = hourlyWeatherData?.hourly.map(data => data.fxTime.slice(11, 16)) ?? []
  const hourlyTemp = hourlyWeatherData?.hourly.map(data => data.temp) ?? []

  const hourlyData = {
    title: '24小时温度',
    time: hourlyTime,
    data: [
      {
        name: '温度',
        data: hourlyTemp,
        color: '#43fcaf',
      },
    ],
  }

  return (
    <>
      <button
        className="
                border-2 text-base rounded-xl
                text-black dark:text-white/80
                bg-yellow-400 dark:bg-blue-600/80
                dark:border-blue-300
                hover:bg-yellow-500 dark:hover:bg-blue-500
                hover:scale-110 transition-all
                active:scale-90
                px-2
                cursor-pointer
                "
        onClick={() => setShow(true)}
      >
        图表
      </button>
      {show &&
        createPortal(
          <div
            className="
                fixed inset-0           /* 全屏覆盖 */
                z-50                    /* 最高层级 */
                flex items-center justify-center  /* 内容居中 */
                bg-black/70             /* 黑色半透明遮罩 */
            "
            onClick={() => setShow(false)} // 点击遮罩关闭
          >
            <div
              className="
                        w-2/3 h-2/3 
                        bg-yellow-100 dark:bg-gray-700 
                        rounded-2xl 
                        p-4 relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="
                            absolute
                            w-8 h-8
                            z-10
                            top-3 left-3
                            cursor-pointer
                            flex items-center justify-center
                            text-gray-500 hover:text-red-500
                            bg-blue-200/80 hover:bg-blue-200
                            dark:bg-white/80 dark:hover:bg-white
                            rounded-full
                            transition-all duration-200
                            hover:scale-110
                            "
                onClick={() => setShow(false)} // ← 绑定关闭事件
              >
                ✕
              </button>
              <button
                className="
                                absolute
                                z-10
                                top-2 left-20
                                bg-blue-400/80 hover:bg-blue-400
                                text-black dark:text-white 
                                font-bold text-xl
                                px-4 py-2
                                rounded-sm
                                cursor-pointer
                                hover:scale-110
                            "
                onClick={() => setIsSevenDayData(!isSevenDayData)}
              >
                切换图表
              </button>
              <SevenTempChart chartData={isSevenDayData ? sevenDaydata : hourlyData} />
            </div>
          </div>,
          document.body //使用 Portal 逃离父容器限制！渲染到body中
        )}
    </>
  )
}
