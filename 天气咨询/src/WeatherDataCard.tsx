import './WeatherDataCard.css'
export default function WeatherDataCard({ data }: { data: any }) {
    const title = '卡片名称'
    const iconCode = 100
  return (
    <div className='weather-data-card'>
      <div className='weather-data-card-header'>{title}</div>
      <i className={'qi-'+iconCode}></i>
      <div className='card-data'>{data}</div>
    </div>
  )
}