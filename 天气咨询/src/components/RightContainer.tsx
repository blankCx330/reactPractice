import WeatherDataCard from './WeatherDataCard'
import WindDirectionAndAirData from './WindDirectionAndAirData'
import SunriseAndMoonriseTimes from './SunriseAndMoonriseTimes'
import RealTimeCard from './RealTimeCard'
import { useLocationStore } from '../hooks/useLocationStore'
import { useWeatherDailyData } from '../hooks/useWeatherDailyData'
import { useWeatherHourly } from '../hooks/useWeatherHourly'

import '../css/RightContainer.css'
export default function RightContainer() {
  const location = useLocationStore(state => state.location)
  const { data: weatherDaily, isLoading: weatherDailyIsLoading } = useWeatherDailyData(
    location.lon,
    location.lat
  )

  const minTemp = weatherDailyIsLoading ? '加载中...' : weatherDaily?.daily[0].tempMin
  const maxTemp = weatherDailyIsLoading ? '加载中...' : weatherDaily?.daily[0].tempMax
  const sunrise = weatherDailyIsLoading ? '加载中...' : weatherDaily?.daily[0].sunrise
  const moonrise = weatherDailyIsLoading ? '加载中...' : weatherDaily?.daily[0].moonrise
  const precip = weatherDailyIsLoading ? '加载中...' : weatherDaily?.daily[0].precip
  const humidity = weatherDailyIsLoading ? '加载中...' : weatherDaily?.daily[0].humidity

  const { data: twentyFourWeather, isLoading: weatherHourlyIsLoading } = useWeatherHourly(
    location.lon,
    location.lat
  )

  return (
    <div className="right-container">
      <div className="weather-data">
        <div className="weather-data-top">
          <WindDirectionAndAirData />
          <SunriseAndMoonriseTimes sunrise={sunrise} moonrise={moonrise} />
        </div>
        <div className="weather-data-bottom">
          <WeatherDataCard title={'最低气温'} data={minTemp} iconCode={2082} unit={'°C'} />
          <WeatherDataCard title={'最高气温'} data={maxTemp} iconCode={2081} unit={'°C'} />
          <WeatherDataCard title={'总降水量'} data={precip} iconCode={309} unit={'mm'} />
          <WeatherDataCard title={'湿度'} data={humidity} iconCode={399} unit={'%'} />
        </div>
      </div>
      <div className="real-time-weather-data before:bg-black dark:before:bg-white">
        {weatherHourlyIsLoading ? '加载中...' : twentyFourWeather &&
          twentyFourWeather?.hourly.map(data => (
            <RealTimeCard
              key={data.fxTime}
              time={data.fxTime}
              iconCode={data.icon}
              temp={data.temp}
            />
          ))}
      </div>
    </div>
  )
}
