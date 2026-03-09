import './css/TodaySWeather.css'
import type { WeatherNowResponse, CityLookupResponse } from './types/qweather'
export default function TodaySWeather({useWeather, nowCityData}:{useWeather?: WeatherNowResponse | null, nowCityData?: CityLookupResponse | null}) {
    const temperature = useWeather?.now.temp;
    const iconDay = useWeather?.now.icon;
    const text = useWeather?.now.text;

    const date = new Date();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const today = weekdays[new Date().getDay()]

    const cityCountry = nowCityData ? nowCityData.location[0].country  : '未知国家'
    const cityAdm = nowCityData ? nowCityData.location[0].adm1 : '未知省份'
    const cityName = nowCityData ? nowCityData.location[0].adm2 : '未知城市'
    const cityRegion = nowCityData ? nowCityData.location[0].name : '未知地区'
    
    return(
        <div className="today-weather">
            <span className='now-title'>今日天气</span>
            <div className='temperature'>{temperature}<span className='celsius-symbol'>℃</span></div>
            <div className='now-weather-photo'>
                <i className={'qi-'+ iconDay}></i>
            </div>
            <div className='now-weather-text'>{text}</div>
            <div className='divider'></div>
            <div className='now-date'>{date.getMonth() + 1}月{date.getDate()}日 {today}</div>
            <div className='city'>{cityCountry} {cityAdm} {cityName} {cityRegion}</div>
        </div>
    )
}