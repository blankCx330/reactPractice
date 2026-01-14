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
                    <WeatherDataCard title={'最高气温'} data={100} iconCode={2081} unit={'°C'} />
                    <WeatherDataCard title={'最低气温'} data={100} iconCode={2081} unit={'°C'} />
                    <WeatherDataCard title={'总降水量'} data={100} iconCode={309} unit={'mm'} />
                    <WeatherDataCard title={'湿度'} data={100} iconCode={399} unit={'%'} />
                </div>
            </div>
            <div className='real-time-weather-data'></div>
        </div>
    )
}