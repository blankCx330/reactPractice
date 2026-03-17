import '../../css/RightContainer.css'

export default function RightContainerSkeleton() {
  const list = new Array(24)
  return (<>
    <div className="right-container">
      <div className="weather-data">
        <div className="weather-data-top">
          <div className="wind-direction-and-air-data animate-pulse"></div>
          <div className="sunrise-and-moonrise-times animate-pulse"></div>
        </div>
        <div className="weather-data-bottom">
          <div className="weather-data-card animate-pulse"></div>
          <div className="weather-data-card animate-pulse"></div>
          <div className="weather-data-card animate-pulse"></div>
          <div className="weather-data-card animate-pulse"></div>
        </div>
      </div>
      <div className="real-time-weather-data">
        {list.map(list => <div className="real-time-card animate-pulse">{list}</div>)}
      </div>
    </div>
  </>)
}
