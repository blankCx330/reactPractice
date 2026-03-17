import { useQuery } from '@tanstack/react-query'
import type { AirQualityCurrentResponse } from '../types/qweather'

const apiHost = import.meta.env.VITE_API_HOST
const apiKey = import.meta.env.VITE_API_KEY
export const useAirQuality = (lon: string | null, lat: string | null) => {
  const data = useQuery<AirQualityCurrentResponse>({
    queryKey: ['airQuality', lon, lat],
    queryFn: async () => {
      const airQualityUrl = `https://${apiHost}/airquality/v1/current/${lat}/${lon}?key=${apiKey}`
      return fetch(airQualityUrl).then(res => res.json())
    },
    enabled: lon !== null && lat !== null,
  })
  return data
}
