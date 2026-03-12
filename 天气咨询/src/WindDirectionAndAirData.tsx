import './css/WindDirectionAndAirData.css'
import type { AirQualityCurrentResponse } from './types/qweather'
export default function WindDirectionAndAirData({airquality}:{airquality?: AirQualityCurrentResponse | undefined}) {
    const index = airquality?.indexes?.[0]?.aqi
    const category = airquality?.indexes?.[0]?.category
    const color = airquality?.indexes?.[0]?.color
    const pollutants = airquality?.pollutants;

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
                {pollutants && (
                    <>
                        <span className='pollutant-name'>{pollutants[0].name}</span>
                        <span className='pollutant-text'><span className='pollutant-value'>{pollutants[0].concentration.value}</span> 
                        <span className='pollutant-unit'>{pollutants[0].concentration.unit}</span>
                        </span>
                    </>)}
            </div>
            <div className='pollutant-2'>
                {pollutants && (
                    <>
                        <span className='pollutant-name'>{pollutants[1].name}</span>
                        <span className='pollutant-text'><span className='pollutant-value'>{pollutants[1].concentration.value}</span> 
                        <span className='pollutant-unit'>{pollutants[1].concentration.unit}</span>
                        </span>
                    </>)}
                </div>
            <div className='pollutant-3'>
                {pollutants && (
                    <>
                        <span className='pollutant-name'>{pollutants[2].name}</span>
                        <span className='pollutant-text'><span className='pollutant-value'>{pollutants[2].concentration.value}</span> 
                        <span className='pollutant-unit'>{pollutants[2].concentration.unit}</span>
                        </span>
                    </>)}
                </div>
            <div className='pollutant-4'>
                {pollutants && (
                    <>
                        <span className='pollutant-name'>{pollutants[3].name}</span>
                        <span className='pollutant-text'><span className='pollutant-value'>{pollutants[3].concentration.value}</span> 
                        <span className='pollutant-unit'>{pollutants[3].concentration.unit}</span>
                        </span>
                    </>)}
            </div>
        </div>
    )
}
