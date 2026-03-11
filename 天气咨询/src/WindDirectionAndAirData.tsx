import './css/WindDirectionAndAirData.css'
import type { AirQualityCurrentResponse } from './types/qweather'
export default function WindDirectionAndAirData({airquality}:{airquality?: AirQualityCurrentResponse | undefined}) {
    const index = airquality?.indexes?.[0]?.aqi
    const category = airquality?.indexes?.[0]?.category
    const color = airquality?.indexes?.[0]?.color

    return (
        <div className='wind-direction-and-air-data'>
            <div className='air-quality' style={{borderLeft: `4px solid rgb(${color?.red},${color?.green},${color?.blue})`}}>
                <span className='air-quality-text'> 
                    <span className='air-quality-name'>空气质量:</span>
                    {airquality && (<span 
                                        className='air-quality-index'
                                        style={{
                                            color: `rgba(${color?.red},${color?.green},${color?.blue},${color?.alpha})`,
                                            background: `rgba(${color?.red},${color?.green},${color?.blue}, 0.15)`,
                                            }}
                                        
                                    >{index}</span>)}
                </span>
                
                {airquality && (<span className='air-quality-level'>{category}</span>)}
            </div>
            <i className="qi-2208"></i>
            <div className='pollutant-1'>
                <span className='pollutant-name'>PM 2.5</span>
                <span className='pollutant-text'><span className='pollutant-value'>8.5</span> <span className='pollutant-unit'>μg/m³</span></span>
            </div>
            <div className='pollutant-2'>
                <span className='pollutant-name'>PM 10</span>
                <span className='pollutant-text'><span className='pollutant-value'>12.3</span> <span className='pollutant-unit'>μg/m³</span></span>
            </div>
            <div className='pollutant-3'>
                <span className='pollutant-name'>SO₂</span>
                <span className='pollutant-text'><span className='pollutant-value'>5.2</span> <span className='pollutant-unit'>μg/m³</span></span>
            </div>
            <div className='pollutant-4'>
                <span className='pollutant-name'>NO₂</span>
                <span className='pollutant-text'><span className='pollutant-value'>8.1</span> <span className='pollutant-unit'>μg/m³</span></span>
            </div>
        </div>
    )
}
