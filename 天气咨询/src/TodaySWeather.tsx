import './css/TodaySWeather.css'
import { useLocationStore } from './hooks/useLocationStore'
import { useWeatherNowData } from './hooks/useWeatherNowData'
import { useCityData } from './hooks/useCityData'
export default function TodaySWeather() {
  const location = useLocationStore(state => state.location)
  const { data: useWeather, isLoading: weatherIsLoading } = useWeatherNowData(
    location.lon,
    location.lat
  )
  const temperature = weatherIsLoading ? '--' : (useWeather?.now.temp ?? '--')
  const iconDay = weatherIsLoading ? '加载中' : (useWeather?.now?.icon ?? ':(')
  const text = weatherIsLoading ? '加载中' : (useWeather?.now?.text ?? '--')

  const date = new Date()
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const today = weekdays[new Date().getDay()]

  const { data: cityData, isLoading: cityDataIsLoading } = useCityData(location.lon, location.lat)
  const cityCountry = cityDataIsLoading
    ? '加载中'
    : (cityData?.location?.[0]?.country ?? '未知国家')
  const cityAdm = cityDataIsLoading ? '加载中' : (cityData?.location?.[0]?.adm1 ?? '未知省份')
  const cityName = cityDataIsLoading ? '加载中' : (cityData?.location?.[0]?.adm2 ?? '未知城市')
  const cityRegion = cityDataIsLoading ? '加载中' : (cityData?.location?.[0]?.name ?? '未知地区')

  return (
    <div className="today-weather">
      <span className="now-title">今日天气</span>
      <div className="temperature">
        {temperature}
        <span className="celsius-symbol">℃</span>
      </div>
      <div className="now-weather-photo">
        <i className={'qi-' + iconDay}></i>
      </div>
      <div className="now-weather-text">{text}</div>
      <div className="divider"></div>
      <div className="now-date">
        {date.getMonth() + 1}月{date.getDate()}日 {today}
      </div>
      <div className="city">
        {cityCountry} {cityAdm} {cityName} {cityRegion}
      </div>
    </div>
  )
}
