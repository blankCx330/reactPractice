import WeatherDataCard from './WeatherDataCard'
import WindDirectionAndAirData from './WindDirectionAndAirData'
import SunriseAndMoonriseTimes from './SunriseAndMoonriseTimes'
import RealTimeCard from './RealTimeCard'

import './RightContainer.css'
export default function RightContainer() {
    const a = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24'];
    const list = a.map((num) => <RealTimeCard time={num} iconCode={100}/>)
    
    return(
        <div className='right-container'>
            <div className='weather-data'>
                <div className='weather-data-top'>
                    <WindDirectionAndAirData />
                    <SunriseAndMoonriseTimes />
                </div>
                <div className='weather-data-bottom'>
                    <WeatherDataCard title={'最高气温'} data={100} iconCode={2081} unit={'°C'} />
                    <WeatherDataCard title={'最低气温'} data={100} iconCode={2082} unit={'°C'} />
                    <WeatherDataCard title={'总降水量'} data={100} iconCode={309} unit={'mm'} />
                    <WeatherDataCard title={'湿度'} data={100} iconCode={399} unit={'%'} />
                </div>
            </div>
            <div className='real-time-weather-data'>
                {list}
            </div>
        </div>
    )
}