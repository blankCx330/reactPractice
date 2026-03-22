import { useQuery } from '@tanstack/react-query'
import type { WeatherDailyResponse } from '../types/qweather'

const apiHost = import.meta.env.VITE_API_HOST
const apiKey = import.meta.env.VITE_API_KEY

//获取对应维度七日的天气数据
export const useWeatherDailyData = (lon: string | null, lat: string | null) => {
  const data = useQuery<WeatherDailyResponse>({
    queryKey: ['weatherDaily', lon, lat],
    queryFn: async () => {
      const url = `https://${apiHost}/v7/weather/7d?location=${lon},${lat}&key=${apiKey}`
      return fetch(url).then(res => res.json())
    },
    enabled: lon !== null && lat !== null,
  })
  return data
}
