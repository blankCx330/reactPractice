import '../css/WindDirectionAndAirData.css'
import { useLocationStore } from '../hooks/useLocationStore'
import { useAirQuality } from '../hooks/useAirQuality'
export default function WindDirectionAndAirData() {
  const location = useLocationStore(state => state.location)
  const { data: airQuality, isLoading: airQualityIsLoading } = useAirQuality(
    location.lon,
    location.lat
  )

  const index = airQualityIsLoading ? '加载中...' : airQuality?.indexes?.[0]?.aqi
  const category = airQualityIsLoading ? '加载中...' : airQuality?.indexes?.[0]?.category
  const color = airQuality?.indexes?.[0]?.color
  const pollutants = airQuality?.pollutants

  return (
    <div className="wind-direction-and-air-data text-black bg-[rgb(0,216,151)] dark:text-white dark:bg-[rgb(60,60,60)]">
      <div
        className="air-quality dark:bg-white/5"
        style={{ border: `4px solid rgba(${color?.red},${color?.green},${color?.blue},0.8)` }}
      >
        <span className="air-quality-text text-black dark:text-white/90">
          <span className="air-quality-name">空气质量:</span>
          {airQuality && (
            <span
              className="air-quality-index border-2"
              style={{
                color: `rgba(${color?.red},${color?.green},${color?.blue},${color?.alpha})`,
                background: `rgba(${color?.red},${color?.green},${color?.blue}, 0.2)`,
              }}
            >
              {index}
            </span>
          )}
        </span>

        {airQuality && <span className="air-quality-level text-black dark:text-white/80">{category}</span>}
      </div>
      <i className="qi-2208"></i>
      <div className="pollutant-1">
        {pollutants && (
          <>
            <span className="pollutant-name">{pollutants[0].name}</span>
            <span className="pollutant-text">
              <span className="pollutant-value">{pollutants[0].concentration.value}</span>
              <span className="pollutant-unit">{pollutants[0].concentration.unit}</span>
            </span>
          </>
        )}
      </div>
      <div className="pollutant-2">
        {pollutants && (
          <>
            <span className="pollutant-name">{pollutants[1].name}</span>
            <span className="pollutant-text">
              <span className="pollutant-value">{pollutants[1].concentration.value}</span>
              <span className="pollutant-unit">{pollutants[1].concentration.unit}</span>
            </span>
          </>
        )}
      </div>
      <div className="pollutant-3">
        {pollutants && (
          <>
            <span className="pollutant-name">{pollutants[2].name}</span>
            <span className="pollutant-text">
              <span className="pollutant-value">{pollutants[2].concentration.value}</span>
              <span className="pollutant-unit">{pollutants[2].concentration.unit}</span>
            </span>
          </>
        )}
      </div>
      <div className="pollutant-4">
        {pollutants && (
          <>
            <span className="pollutant-name">{pollutants[3].name}</span>
            <span className="pollutant-text">
              <span className="pollutant-value">{pollutants[3].concentration.value}</span>
              <span className="pollutant-unit">{pollutants[3].concentration.unit}</span>
            </span>
          </>
        )}
      </div>
    </div>
  )
}
