import WeatherDataCard from './WeatherDataCard'
import WindDirectionAndAirData from './WindDirectionAndAirData'
import SunriseAndMoonriseTimes from './SunriseAndMoonriseTimes'

import './RightContainer.css'
export default function RightContainer() {
    
    return(
        <div className='right-container'>
            <div className='weather-data'>
                <div className='weather-data-top'>
                    <WindDirectionAndAirData />
                    <SunriseAndMoonriseTimes />
                </div>
                <div className='weather-data-bottom'>
                    <WeatherDataCard data={100} />
                    <WeatherDataCard data={100} />
                    <WeatherDataCard data={100} />
                    <WeatherDataCard data={100} />
                </div>
            </div>
            <div className='real-time-weather-data'></div>
        </div>
    )
}