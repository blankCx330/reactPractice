import TodaySWeather from './TodaySWeather'
import SevenDayWeather from './SevenDayWeather'

import './css/LeftContainer.css'

import type { WeatherNowResponse, CityLookupResponse, WeatherDailyResponse } from './types/qweather'
export default function LeftContainer({useWeather, nowCityData, sevenWeather}:{useWeather?: WeatherNowResponse | null, nowCityData?: CityLookupResponse | null, sevenWeather?: WeatherDailyResponse | undefined}) {
    
    return (
        <div className="left-container">
            <TodaySWeather useWeather={useWeather} nowCityData={nowCityData}/>
            <SevenDayWeather sevenWeather={sevenWeather}/>
        </div>
    )
}