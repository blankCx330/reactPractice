import TodaySWeather from './TodaySWeather'
import SevenDayWeather from './SevenDayWeather'

import './css/LeftContainer.css'

import type { WeatherNowResponse, CityLookupResponse } from './types/qweather'
export default function LeftContainer({useWeather, nowCityData, lon, lat}:{useWeather?: WeatherNowResponse | null, nowCityData?: CityLookupResponse | null, lon:number, lat:number}) {
    
    return (
        <div className="left-container">
            <TodaySWeather useWeather={useWeather} nowCityData={nowCityData}/>
            <SevenDayWeather nowCityData={nowCityData} lon={lon} lat={lat}/>
        </div>
    )
}