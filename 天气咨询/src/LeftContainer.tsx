import TodaySWeather from './TodaySWeather'
import SevenDayWeather from './SevenDayWeather'

import './css/LeftContainer.css'

import type { WeatherNowResponse, CityLookupResponse } from './types/qweather'
export default function LeftContainer({useWeather, nowCityData}:{useWeather?: WeatherNowResponse | null, nowCityData?: CityLookupResponse | null}) {
    
    return (
        <div className="left-container">
            <TodaySWeather useWeather={useWeather} nowCityData={nowCityData}/>
            <SevenDayWeather useWeather={useWeather}/>
        </div>
    )
}