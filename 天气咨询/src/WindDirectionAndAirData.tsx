import './WindDirectionAndAirData.css'
export default function WindDirectionAndAirData() {
    return (
        <div className='wind-direction-and-air-data'>
            <div className='air-quality'>
                <span className='air-quality-text'> 
                    <span className='air-quality-name'>空气质量:</span>
                    <span className='air-quality-index'>1.0</span>
                </span>
                
                <span className='air-quality-level'>优</span>
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
