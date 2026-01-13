import WeatherDataCard from './WeatherDataCard'

import './RightContainer.css'
export default function RightContainer() {
    
    return(
        <div className='right-container'>
            <div className='weather-data'>
                <div className='wind-direction-and-air-data'>
                    <div className='air-quality'>空气质量: <span className='air-quality-index'>1.0</span></div>
                    <i className="qi-2208"></i>
                </div>
                <div className='sunrise-and-moonrise-times'></div>
                <WeatherDataCard data={100} />
            </div>
            <div className='real-time-weather-data'></div>
        </div>
    )
}