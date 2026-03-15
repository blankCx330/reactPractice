import { useQuery } from '@tanstack/react-query'
import { useDebouncedValue } from './useDebouncedValue'
import type { CityLookupResponse } from '../types/qweather'

const apiHost = import.meta.env.VITE_API_HOST
const apiKey = import.meta.env.VITE_API_KEY

export const useCityLocation = (cityName: string) => {
  const debouncedCityName = useDebouncedValue(cityName, 300)

  const data = useQuery<CityLookupResponse>({
    queryKey: ['cityLocation', debouncedCityName],
    queryFn: async () => {
      const cityUrl = `https://${apiHost}/geo/v2/city/lookup?&location=${cityName}&key=${apiKey}`
      return fetch(cityUrl).then(res => res.json())
    },
    enabled: cityName.length > 1,
  })
  return data
}
