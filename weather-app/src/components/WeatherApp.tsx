import TopContainer from './TopContainer'
import LeftContainer from './LeftContainer'
import RightContainer from './RightContainer'
import ErrorBoundary from './ErrorBoundary'
import { useLocationStore } from '../hooks/useLocationStore'
import { useEffect } from 'react'
import { useUserLocation } from '../hooks/useUserLocation'
// import { useCityData } from '../hooks/useCityData'
// import { useWeatherNowData } from '../hooks/useWeatherNowData'
import { useWeatherDailyData } from '../hooks/useWeatherDailyData'
import { LeftContainerSkeleton, RightContainerSkeleton } from '../components/skeleton'
import { useThemeStore } from '../hooks/useThemeStore'
// import TempChart from './chart/SevenTempChart'

export default function WeatherApp() {
  //通过hook获取当前经纬度
  const { data: userLocation, isLoading: uerLocationIsLoading } = useUserLocation()

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

  const theme = useThemeStore(state => state.theme)

  //监听theme状态,第一次加载时同步主题到 DOM
  //document.documentElement.classList.add('dark')可以往<html>中的class添加dark
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // //获取对应经纬度的城市地理数据
  // const { data: nowCityData } = useCityData(lon, lat)
  // //获取对应维度的天气数据
  // const { data: useWeather } = useWeatherNowData(lon, lat)
  // //获取对应维度七日的天气数据
  const { isLoading: sevenWeatherIsLoading } = useWeatherDailyData(lon, lat)

  return (
    <div className="weather-app bg-blue-300 dark:bg-black">
      {
        <>
          <ErrorBoundary>
            <TopContainer />
          </ErrorBoundary>
          <div className="main-content">
            {uerLocationIsLoading ? <LeftContainerSkeleton /> : <LeftContainer />}
            {sevenWeatherIsLoading ? <RightContainerSkeleton /> : <RightContainer />}
          </div>
        </>
      }
    </div>
  )
}
