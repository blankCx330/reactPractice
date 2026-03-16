import { useQuery } from '@tanstack/react-query'
import type { GridWeatherHourlyResponse } from '../types/qweather'

const apiHost = import.meta.env.VITE_API_HOST
const apiKey = import.meta.env.VITE_API_KEY

export const useWeatherHourly = (lon: number | null, lat: number | null) => {
  const data = useQuery<GridWeatherHourlyResponse>({
    queryKey: ['wearherHourly', lon, lat],
    queryFn: async () => {
      const wearherHourlyUrl = `https://${apiHost}/v7/grid-weather/24h?location=${lon},${lat}&key=${apiKey}`
      return fetch(wearherHourlyUrl).then(res => res.json())
    },
    enabled: lon !== null && lat !== null,
  })
  return data
}
