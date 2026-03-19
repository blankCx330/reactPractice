import '../css/RealTimeCard.css'

export default function RealTimeCard({
  time,
  iconCode,
  temp,
}: {
  time: string
  iconCode: string
  temp: string
}) {
  const displayTime = time.slice(11, 16)
  const dayTime = time.slice(5, 10)
  return (
    <div className="real-time-card text-black border-2 bg-yellow-500/90 dark:text-white dark:bg-[rgb(60,60,60)]">
      <div className="real-time">{dayTime}</div>
      <div className="real-time">{displayTime}</div>
      <div className="real-time-temperature">{temp}°C</div>
      <i className={'qi-' + iconCode}></i>
    </div>
  )
}
