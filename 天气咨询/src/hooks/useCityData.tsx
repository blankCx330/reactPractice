import type { CityLookupResponse } from '../types/qweather'
import { useQuery } from '@tanstack/react-query'

const apiHost = import.meta.env.VITE_API_HOST
const apiKey = import.meta.env.VITE_API_KEY

//获取对应经纬度的城市地理数据
export const useCityData = (lon: number, lat: number) => {
  const data = useQuery<CityLookupResponse | null>({
    queryKey: ['searchCity', lon, lat],
    queryFn: async () => {
      const searchUrl = `https://${apiHost}/geo/v2/city/lookup?location=${lon},${lat}&key=${apiKey}`
      return fetch(searchUrl).then(res => res.json())
    },
    enabled: lon !== null && lat !== null, // 只有当经纬度都不为null时才启用查询
  })
  return data
}
