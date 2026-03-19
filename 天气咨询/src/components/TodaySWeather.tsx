import '../css/TodaySWeather.css'
import FavoriteIcon from '../iconSVG/FavoriteIcon'
import { useLocationStore } from '../hooks/useLocationStore'
import { useWeatherNowData } from '../hooks/useWeatherNowData'
import { useCityData } from '../hooks/useCityData'
import { useFavoritesCityStore } from '../hooks/useFavoritesCityStore'
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

  const addCity = useFavoritesCityStore(state => state.addCity)
  const removeCity = useFavoritesCityStore(state => state.removeCity)
  const isInList = useFavoritesCityStore(state => state.isInList)
  //不订阅结果(list)的话zustand会认为什么都没改变,就不会触发重渲染
  //但list已经正常添加，切换到别的城市再切回来可以看到收藏按键正常亮起
  const list = useFavoritesCityStore(state => state.list)

  const cityId = cityData ? cityData?.location?.[0].id : ''
  const isFavorited = isInList(cityId)

  const handleFavoriteOnClick = () => {
    if (!cityData) return

    if (isFavorited) {
      removeCity(cityId)
    } else {
      addCity({
        id: cityId,
        name: cityData.location[0].name,
        adm2: cityData.location[0].adm2,
        lon: cityData.location[0].lon,
        lat: cityData.location[0].lat,
      })
    }
  }

  return (
    <div className="today-weather transition-all bg-[rgb(229,231,120)] dark:bg-[rgb(60,60,60)]">
      <span className="now-title text-black dark:text-white">今日天气</span>
      <div
        className="favorite-btn select-none cursor-pointer size-10"
        onClick={handleFavoriteOnClick}
      >
        <FavoriteIcon
          filled={isFavorited}
          size={45}
          className={isFavorited ? 'text-yellow-400' : 'text-gray-400'}
        />
      </div>
      <div className="temperature text-black dark:text-white">
        {temperature}
        <span className="celsius-symbol">℃</span>
      </div>
      <div className="now-weather-photo text-black dark:text-white">
        <i className={'qi-' + iconDay}></i>
      </div>
      <div className="now-weather-text text-black dark:text-white">{text}</div>
      <div className="divider bg-black dark:bg-white"></div>
      <div className="now-date text-black/70 dark:text-white/70">
        {date.getMonth() + 1}月{date.getDate()}日 {today}
      </div>
      <div className="city text-black/80 dark:text-white/80">
        {cityCountry} {cityAdm} {cityName} {cityRegion}
      </div>
    </div>
  )
}
