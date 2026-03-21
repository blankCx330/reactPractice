import { useAIStream } from '../../hooks/useAIStream'
import type { AICommentRequest } from '../../types/qweather'
import { useLocationStore } from '../../hooks/useLocationStore'
import { useCityData } from '../../hooks/useCityData'
import { useWeatherDailyData } from '../../hooks/useWeatherDailyData'
import { useWeatherNowData } from '../../hooks/useWeatherNowData'
export default function AIComment() {
  const location = useLocationStore(state => state.location)
  const { data: cityData } = useCityData(location.lon, location.lat)
  const { data: now } = useWeatherNowData(location.lon, location.lat)
  const { data: weatherData } = useWeatherDailyData(location.lon, location.lat)

  const { content, isLoading, error, generateComment, canel, clearContent } = useAIStream()

  const handleGenerate = () => {
    const data: AICommentRequest = {
      city: `${cityData?.location[0].adm1}-${cityData?.location[0].adm2}-${cityData?.location[0].name}`,
      weather: weatherData?.daily[0].textDay,
      nowTemp: now?.now.temp,
      maxTemp: weatherData?.daily[0].tempMax,
      minTemp: weatherData?.daily[0].tempMin,
      precip: weatherData?.daily[0].precip, //降水量 毫米
      humidity: weatherData?.daily[0].humidity, //湿度 百分比
      uvIndex: weatherData?.daily[0].uvIndex, //紫外线强度
      vis: weatherData?.daily[0].vis, //能见度
      windDirDay: weatherData?.daily[0].windDirDay, //白天风向
      windScaleDay: weatherData?.daily[0].windScaleDay, //白天风力 公里/小时
      windDirNight: weatherData?.daily[0].windDirNight, //夜间风向
      windScaleNight: weatherData?.daily[0].windScaleNight, //夜间风力 公里/小时
    }
    generateComment(data)
  }

  return (
    <div
      className="
                rounded-4xl
                w-[95%] sm:w-4/5
                h-[90%] sm:h-4/5
                max-w-3xl max-h-[80vh]
                bg-yellow-100/90 dark:bg-[rgb(60,60,60)]
                dark:border-2 dark:border-white/50
                shadow-[0_4px_15px_rgba(0,0,0,0.3)]
                flex flex-col overflow-hidden
             "
      onClick={e => e.stopPropagation()}
    >
      {/* Header */}
      <div
        className="
                px-6 py-4 
                border-b-2 border-yellow-300/50 dark:border-white/20
                bg-yellow-200/50 dark:bg-white/5
                flex items-center justify-between
                shrink-0
            "
      >
        <h2
          className="
                    text-lg sm:text-xl font-bold 
                    text-black dark:text-white
                    flex items-center gap-2
                "
        >
          <span className="text-lg font-bold bg-yellow-400 dark:bg-blue-500 rounded-full px-2 py-0.5">
            AI
          </span>
          智能天气点评
        </h2>
      </div>

      {/* Content Area */}
      <div
        className="
                flex-1 
                p-4 sm:p-6 
                overflow-y-auto
            "
      >
        {content ? (
          <div
            className="
                        text-black dark:text-white/90 
                        leading-relaxed 
                        whitespace-pre-wrap
                        text-sm sm:text-base
                    "
          >
            {content}
          </div>
        ) : (
          <div
            className="
                        h-full flex flex-col items-center justify-center 
                        text-gray-500 dark:text-white/50
                        gap-3
                    "
          >
            <i className="qi-103 text-4xl sm:text-5xl"></i>
            <p className="text-center text-sm sm:text-base">点击"开始点评"获取AI天气分析</p>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div
          className="
                    mx-4 sm:mx-6 mb-4 p-3 sm:p-4
                    bg-red-100/80 dark:bg-red-900/30
                    border-2 border-red-300 dark:border-red-500/50
                    rounded-xl
                    flex items-center gap-3
                "
        >
          <span
            className="
                    px-2 py-0.5 text-xs font-bold 
                    bg-red-500 text-white rounded
                "
          >
            错误
          </span>
          <span
            className="
                        flex-1 
                        text-red-700 dark:text-red-300
                        text-xs sm:text-sm
                    "
          >
            {error}
          </span>
          <button
            onClick={handleGenerate}
            className="
                            border-2 rounded-full px-3 sm:px-4 py-1.5
                            text-red-700 dark:text-red-300
                            bg-red-200/50 dark:bg-red-800/50
                            border-red-400 dark:border-red-500
                            hover:bg-red-300 dark:hover:bg-red-700
                            hover:scale-105 transition-all
                            active:scale-95
                            text-xs sm:text-sm font-medium
                            whitespace-nowrap
                        "
          >
            重试
          </button>
        </div>
      )}

      {/* Actions Row */}
      <div
        className="
                px-4 sm:px-6 py-4 
                border-t-2 border-yellow-300/50 dark:border-white/20
                bg-yellow-200/30 dark:bg-white/5
                flex flex-col-reverse sm:flex-row items-stretch sm:items-center 
                justify-end gap-2 sm:gap-3
                shrink-0
            "
      >
        {/* Primary: Generate */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="
                        border-2 rounded-full px-4 sm:px-6 py-2 sm:py-2.5
                        text-black dark:text-white/90
                        bg-yellow-400 dark:bg-blue-600/80
                        dark:border-blue-300
                        hover:bg-yellow-500 dark:hover:bg-blue-500
                        hover:scale-105 transition-all
                        active:scale-95
                        font-medium
                        disabled:opacity-50 disabled:cursor-not-allowed 
                        disabled:hover:scale-100
                        flex items-center justify-center gap-2
                    "
          aria-label="获取AI智能点评"
        >
          {isLoading ? '生成中...' : '开始点评'}
        </button>

        {/* Secondary: Clear */}
        {content && (
          <button
            onClick={clearContent}
            className="
                            border-2 rounded-full px-3 sm:px-4 py-2
                            text-gray-700 dark:text-white/70
                            bg-yellow-200/80 dark:bg-white/10
                            border-yellow-400 dark:border-white/30
                            hover:bg-yellow-300 dark:hover:bg-white/20
                            hover:scale-105 transition-all
                            active:scale-95
                            text-xs sm:text-sm
                            flex items-center justify-center gap-1
                        "
          >
            清空
          </button>
        )}
      </div>
    </div>
  )
}
