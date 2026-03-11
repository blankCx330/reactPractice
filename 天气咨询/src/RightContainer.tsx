import WeatherDataCard from './WeatherDataCard'
import WindDirectionAndAirData from './WindDirectionAndAirData'
import SunriseAndMoonriseTimes from './SunriseAndMoonriseTimes'
import RealTimeCard from './RealTimeCard'
import { useQuery } from '@tanstack/react-query'
import type { WeatherDailyResponse, GridWeatherHourlyResponse, AirQualityCurrentResponse } from './types/qweather'

import './css/RightContainer.css'
export default function RightContainer({sevenWeather, lon, lat}:{sevenWeather?: WeatherDailyResponse | undefined, lon: number, lat:number} ) {
    const minTemp = sevenWeather?.daily[0].tempMin
    const maxTemp = sevenWeather?.daily[0].tempMax
    const sunrise = sevenWeather?.daily[0].sunrise
    const moonrise = sevenWeather?.daily[0].moonrise
    const precip = sevenWeather?.daily[0].precip
    const humidity = sevenWeather?.daily[0].humidity

    const apiHost = import.meta.env.VITE_API_HOST
    const apiKey = import.meta.env.VITE_API_KEY

        const {data: airquality} = useQuery<AirQualityCurrentResponse>({
        queryKey: ['airquality', lon, lat],
        queryFn: async () => {
            const airQualityUlr = `https://${apiHost}/airquality/v1/current/${lat}/${lon}?key=${apiKey}`
            return fetch(airQualityUlr).then(res => res.json())
        },
        enabled: !!lon && !!lat
    })
    console.log('空气质量',airquality)

    const {data: twentyFourWeather} = useQuery<GridWeatherHourlyResponse>({
        queryKey: ['twentyFourWeather', lon, lat],
        queryFn: async () => {
            const twentyFourWeatherUrl = `https://${apiHost}/v7/grid-weather/24h?location=${lon},${lat}&key=${apiKey}`
            return fetch(twentyFourWeatherUrl).then(res => res.json())
        },
        enabled: !!lon && !!lat
    })


    return(
        <div className='right-container'>
            <div className='weather-data'>
                <div className='weather-data-top'>
                    <WindDirectionAndAirData airquality={airquality}/>
                    <SunriseAndMoonriseTimes sunrise={sunrise} moonrise={moonrise} />
                </div>
                <div className='weather-data-bottom'>
                    <WeatherDataCard title={'最低气温'} data={minTemp} iconCode={2082} unit={'°C'} />
                    <WeatherDataCard title={'最高气温'} data={maxTemp} iconCode={2081} unit={'°C'} />
                    <WeatherDataCard title={'总降水量'} data={precip} iconCode={309} unit={'mm'} />
                    <WeatherDataCard title={'湿度'} data={humidity} iconCode={399} unit={'%'} />
                </div>
            </div>
            <div className='real-time-weather-data'>
                {twentyFourWeather && (
                    twentyFourWeather?.hourly.map((data) => 
                        <RealTimeCard key={data.fxTime} time={data.fxTime} iconCode={data.icon} temp={data.temp}/>
                    )

                )}
            </div>
        </div>
    )
}