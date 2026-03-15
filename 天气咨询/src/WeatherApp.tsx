import TopContainer from './TopContainer'
import LeftContainer from './LeftContainer'
import RightContainer from './RightContainer'
import { useLocationStore } from './hooks/useLocationStore'
import { useEffect } from 'react'
import { useUserLocation } from './hooks/useUserLocation'
import { useCityData } from './hooks/useCityData'
import { useWeatherNowData } from './hooks/useWeatherNowData'
import { useWeatherDailyData } from './hooks/useWeatherDailyData'
import { useTopCity } from './hooks/useTopCity'

export default function WeatherApp() {
  //热门城市列表数据
  const { data: hotCities } = useTopCity()
  const topCityList = hotCities?.topCityList ?? []

  //通过hook获取当前经纬度
  const { data: userLocation } = useUserLocation()

  // const [location, setLocation] = useState({ lon: 116, lat: 39 }) //默认位置为北京

  //使用精准订阅，订阅字段变化时才触发重渲染，避免不必要的性能开销
  const location = useLocationStore(state => state.location)
  const setLocation = useLocationStore(state => state.setLocation)

  const { lon, lat } = location //解析用户当前位置，

  //监听，userLocation每5分钟刷新，userLocation变化后刷新数据(再获取到初始数据后，进行第一次刷新)
  useEffect(() => {
    if (userLocation) {
      const lon = userLocation.lon
      const lat = userLocation.lat
      setLocation({ lon, lat }) //变量名相同可以直接简写,完整写发为({lon:lon, lat:lat})
    }
  }, [userLocation])

  //获取对应经纬度的城市地理数据
  const { data: nowCityData } = useCityData(lon, lat)
  //获取对应维度的天气数据
  const { data: useWeather } = useWeatherNowData(lon, lat)
  //获取对应维度七日的天气数据
  const { data: sevenWeather } = useWeatherDailyData(lon, lat)

  return (
    <div className="weather-app">
      <TopContainer />
      <div className="main-content">
        <LeftContainer />
        <RightContainer />
      </div>
    </div>
  )
}
