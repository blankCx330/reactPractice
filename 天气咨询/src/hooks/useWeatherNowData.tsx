import { useQuery } from '@tanstack/react-query'
import type { WeatherNowResponse } from '../types/qweather'

const apiHost = import.meta.env.VITE_API_HOST
const apiKey = import.meta.env.VITE_API_KEY

//获取对应维度的天气数据
export const useWeatherNowData = (lon: number, lat: number) => {
  const data = useQuery<WeatherNowResponse | null>({
    queryKey: ['weather', lon, lat], // 将经纬度作为查询键的一部分，以便在位置变化时重新获取数据
    queryFn: async () => {
      const weatherUrl = `https://${apiHost}/v7/weather/now?location=${lon},${lat}&key=${apiKey}`
      if (!weatherUrl) return null
      return fetch(weatherUrl).then(res => res.json())
    },
    enabled: lon !== null && lat !== null,
  })
  return data
}
