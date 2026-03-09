import TopContainer from "./TopContainer"
import LeftContainer from "./LeftContainer"
import RightContainer from "./RightContainer"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import type { WeatherNowResponse, TopCityResponse, UserLocation, CityLookupResponse} from "./types/qweather"

export default function WeatherApp() {
  const apiHost = import.meta.env.VITE_API_HOST
  const apiKey = import.meta.env.VITE_API_KEY
  const hotCitiesUrl = `https://${apiHost}/geo/v2/city/top?number=7&range=cn&key=${apiKey}`

  //城市列表数据
  const hotCitiesFetch = async (): Promise<TopCityResponse> => {
    return fetch(hotCitiesUrl).then(res => res.json())
  }
  const { data: hotCities } = useQuery<TopCityResponse>({
    queryKey: ['hotCities'],
    queryFn: hotCitiesFetch
  })
  const topCityList = hotCities?.topCityList ?? []
  console.log("城市列表", topCityList)

  //当前经纬度
  const getLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('浏览器不支持定位功能'))
        return
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true, // 高精度模式
        timeout: 300000, // 超时时间，单位毫秒
        maximumAge: 0 // 不使用缓存位置
      })
    })
  }

  const useUserLocation = () => {
    return useQuery<UserLocation>({
      queryKey: ['userLocation'],
      queryFn: async () => {
        const position = await getLocation()
        return {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        }
      },
      staleTime: 5 * 60 * 1000, // 5分钟内数据被认为是新鲜的
      retry: 1 // 失败后重试一次
    })
  }
  const { data: userLocation } = useUserLocation()
  const [lon, setLon] = useState(userLocation?.lon ?? 0)
  const [lat, setLat] = useState(userLocation?.lat ?? 0)
  const setLocation = (lon: number, lat: number) => {
    setLon(lon)
    setLat(lat)
  }
  console.log("用户位置", userLocation)

  //当前位置的天气数据
  const weatherUrl = userLocation 
    ? `https://${apiHost}/v7/weather/now?location=${userLocation.lon},${userLocation.lat}&key=${apiKey}`
    : null

  //用于搜索天气位置的输入框
    const searchUrl = `https://${apiHost}/geo/v2/city/lookup?location=${lon},${lat}&key=${apiKey}`
    const {data: searchCity} = useQuery<CityLookupResponse | null>({
      queryKey: ['searchCity', lon, lat],// 将经纬度作为查询键的一部分，以便在位置变化时重新获取数据
      queryFn: async () => fetch(searchUrl).then(res => res.json())
    })
  const nowCityData = searchCity;

  const getWeather = async (): Promise<WeatherNowResponse | null> => {
    if (!weatherUrl) return null
    return fetch(weatherUrl).then(res => res.json())
  }
  const { data: useWeather } = useQuery<WeatherNowResponse | null>({
    queryKey: ['weather', userLocation],
    queryFn: getWeather,
    enabled: !!userLocation, // 只有在用户位置获取成功后才执行查询
  })
  console.log("当前位置的天气数据", useWeather)


  return (
    <div className="weather-app">
      <TopContainer topCityList={topCityList} />
      <LeftContainer useWeather={useWeather} nowCityData={nowCityData} />
      <RightContainer />
    </div>
  )
}