import './TodaySWeather.css'
export default function TodaySWeather() {
    const temperature = 26;
    const iconDay = 100;
    return(
        <div className="today-weather">
            <span className='now-title'>今日天气</span>
            <div className='temperature'>{temperature}<span className='celsius-symbol'>℃</span></div>
            <div className='now-weather-photo'>
                <i className={'qi-'+ iconDay}></i>
            </div>
            <div className='now-weather-text'>晴</div>
            <div className='divider'></div>
            <div className='now-date'>1月12日 周一</div>
            <div className='city'>城市</div>
        </div>
    )
}