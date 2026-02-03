import './RealTimeCard.css'

export default function RealTimeCard({time, iconCode}: {time: string, iconCode: number}) {
    
    return(
        <div className='real-time-card'>
            <div className='real-time'>{time}</div>
            <div className='real-time-temperature'>{'36'}°C</div>
            <i className={'qi-'+ iconCode}></i>
        </div>
    )
}