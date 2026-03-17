import '../../css/LeftContainer.css'

export default function LeftContainerSkeleton() {
  return (<>
  <div className="left-container">
    <div className="today-weather animate-pulse"></div>
    <div className="seven-day-weather animate-pulse"></div>
  </div>
  </>)
}
