import '../css/SunriseAndMoonriseTimes.css'
export default function SunriseAndMoonriseTimes({
  sunrise,
  moonrise,
}: {
  sunrise?: string | null
  moonrise?: string | null
}) {
  const moonIconCode = 801
  return (
    <div className="sunrise-and-moonrise-times text-black bg-[rgb(0,216,151)] dark:text-white dark:bg-[rgb(60,60,60)]">
      <div className="time-text">日出与月出</div>
      <div className="time-div bg-yellow-200/80 dark:bg-white/10">
        <i className="qi-100"></i>
        <div className="sunrise-time">
          日出时间: <span className="sunrise-time-value border-2">{sunrise ? sunrise : '--:--'}</span>
        </div>
      </div>
      <div className="time-div bg-yellow-200/80 dark:bg-white/10">
        <i className={'qi-' + moonIconCode}></i>
        <div className="moonrise-time">
          月出时间: <span className="moonrise-time-value border-2">{moonrise ? moonrise : '--:--'}</span>
        </div>
      </div>
    </div>
  )
}
