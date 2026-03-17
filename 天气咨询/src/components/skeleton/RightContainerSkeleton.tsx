import '../../css/RightContainer.css'

export default function RightContainerSkeleton() {
  const list = new Array(24)
  return (<>
    <div className="right-container">
      <div className="weather-data">
        <div className="weather-data-top">
          <div className="wind-direction-and-air-data"></div>
          <div className="sunrise-and-moonrise-times"></div>
        </div>
        <div className="weather-data-bottom">
          <div className="weather-data-card"></div>
          <div className="weather-data-card"></div>
          <div className="weather-data-card"></div>
          <div className="weather-data-card"></div>
        </div>
      </div>
      <div className="real-time-weather-data">
        {list.map(list => <div className="real-time-card">{list}</div>)}
      </div>
    </div>
  </>)
}
