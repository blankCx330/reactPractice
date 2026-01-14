import './WeatherDataCard.css'
export default function WeatherDataCard({ data, title, iconCode, unit }: { data: any, title: string, iconCode: number, unit: string}) {
  return (
    <div className='weather-data-card'>
      <div className='weather-data-card-header'>{title}</div>
      <div className="card-content">
        <i className={'qi-'+iconCode}></i>
        <div className="data-container">
          <div className='card-data'>
            {data}
            <span className='card-unit'>{unit}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
