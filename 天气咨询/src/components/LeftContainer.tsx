import TodaySWeather from './TodaySWeather'
import SevenDayWeather from './SevenDayWeather'
import ErrorBoundary from './ErrorBoundary'
import '../css/LeftContainer.css'
import TempChart from './chart/SevenTempChart'

export default function LeftContainer() {
  return (
    <div className="left-container">
      <ErrorBoundary>
        <TodaySWeather />
      </ErrorBoundary>
      <ErrorBoundary>
        <SevenDayWeather />
      </ErrorBoundary>
    </div>
  )
}
