import '../css/WeatherDataCard.css'
export default function WeatherDataCard({
  data,
  title,
  iconCode,
  unit,
}: {
  data: string | undefined
  title: string
  iconCode: number
  unit: string
}) {
  return (
    <div className="weather-data-card text-black bg-yellow-300/70 dark:text-white dark:bg-[rgb(60,60,60)]">
      <div className="weather-data-card-header text-xl">{title}</div>
      <div className="card-content">
        <i className={'qi-' + iconCode}></i>
        <div className="data-container">
          <div className="card-data">
            {data}
            <span className="card-unit">{unit}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
