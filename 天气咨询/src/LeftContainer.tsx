import TodaySWeather from './TodaySWeather'
import SevenDayWeather from './SevenDayWeather'
import './css/LeftContainer.css'

export default function LeftContainer() {
  return (
    <div className="left-container">
      <TodaySWeather />
      <SevenDayWeather />
    </div>
  )
}
