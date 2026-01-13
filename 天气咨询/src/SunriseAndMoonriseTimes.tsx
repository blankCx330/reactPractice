import './SunriseAndMoonriseTimes.css'
export default function SunriseAndMoonriseTimes() {
        const moonIconCode = 801
  return(
    <div className='sunrise-and-moonrise-times'>
        <div className='time-text'>日出与月出</div>
        <div className='time-div'>
          <i className='qi-100'></i><div className='sunrise-time'>日出时间: <span className='sunrise-time-value'>07:00</span></div>
        </div>
        <div className='time-div'>
          <i className={'qi-' + moonIconCode}></i><div className='moonrise-time'>月出时间: <span className='moonrise-time-value'>07:00</span></div>
        </div>
    </div>
  )
}