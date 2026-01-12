import TopContainer from "./TopContainer"
import LeftContainer from "./LeftContainer"
import { useQuery } from "@tanstack/react-query"
export default function WeatherApp() {
  const apiHost = import.meta.env.VITE_API_HOST
  const apiKey = import.meta.env.VITE_API_KEY
  const hotCitiesUrl = `https://${apiHost}/geo/v2/city/top?number=7&range=cn&key=${apiKey}`

  const hotCitiesFetch = async () => {
    return fetch(hotCitiesUrl).then(res => res.json())
  } 

    const {data: hotCities} = useQuery({
    queryKey: ['hotCities'],
    queryFn: hotCitiesFetch
  })

  type TopCity = {
    name: string;
    id: string;
  }
  const topCityList = hotCities?.topCityList?.map((item: TopCity)=> {
    return {
      name: item.name,
      id: item.id
    }
  }) || []
  console.log(topCityList)

  return(
    <div className="weather-app">
      <TopContainer topCityList={topCityList} /> 
      <LeftContainer />
    </div>
  )
}