import { useQuery } from '@tanstack/react-query'
import type { TopCityResponse } from '../types/qweather'

const apiHost = import.meta.env.VITE_API_HOST
const apiKey = import.meta.env.VITE_API_KEY

export const useTopCity = () => {
  const data = useQuery<TopCityResponse>({
    queryKey: ['topCity'],
    queryFn: async () => {
      const topCityUrl = `https://${apiHost}/geo/v2/city/top?number=7&range=cn&key=${apiKey}`
      return fetch(topCityUrl).then(res => res.json())
    },
  })
  return data
}
