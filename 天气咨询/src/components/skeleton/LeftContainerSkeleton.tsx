import '../../css/LeftContainer.css'

export default function LeftContainerSkeleton() {
  return (<>
  <div className="left-container">
    <div className="today-weather bg-[rgb(229,231,120)] dark:bg-[rgb(60,60,60)] animate-pulse"></div>
    <div className="seven-day-weather bg-[rgb(229,231,120)] dark:bg-[rgb(60,60,60)] animate-pulse"></div>
  </div>
  </>)
}
