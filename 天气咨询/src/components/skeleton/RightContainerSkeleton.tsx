import '../../css/RightContainer.css'

export default function RightContainerSkeleton() {
  const list = new Array(24)
  return (<>
    <div className="right-container">
      <div className="weather-data">
        <div className="weather-data-top">
          <div className="wind-direction-and-air-data bg-[rgb(0,216,151)] dark:bg-[rgb(60,60,60)] animate-pulse"></div>
          <div className="sunrise-and-moonrise-times animate-pulse bg-[rgb(0,216,151)] dark:bg-[rgb(60,60,60)]"></div>
        </div>
        <div className="weather-data-bottom">
          <div className="weather-data-card bg-yellow-300/70 dark:bg-[rgb(60,60,60)] animate-pulse"></div>
          <div className="weather-data-card bg-yellow-300/70 dark:bg-[rgb(60,60,60)] animate-pulse"></div>
          <div className="weather-data-card bg-yellow-300/70 dark:bg-[rgb(60,60,60)] animate-pulse"></div>
          <div className="weather-data-card bg-yellow-300/70 dark:bg-[rgb(60,60,60)] animate-pulse"></div>
        </div>
      </div>
      <div className="real-time-weather-data">
        {list.map(list => <div className="real-time-card animate-pulse">{list}</div>)}
      </div>
    </div>
  </>)
}
