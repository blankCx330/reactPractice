import './css/topContainer.css'
import logo from './assets/logo.png'
import Search from './iconSVG/Search'
import MapPositioningSVG from './iconSVG/MapPositioningSVG'
import type { TopCityResponse } from './types/qweather'
export default function TopContainer({topCityList}: {topCityList: TopCityResponse['topCityList']}) {
    const cityList = topCityList.map(city => {
        return <option key={city.id} value={city.name} />
    })
    
    return(
        <div className="top-container">
            <img src={logo} alt="logo" className='logo'/>
            <div className='input-div'>
                <Search />
                <input
                    type='text' 
                    className='city-input' 
                    list='city-list' 
                    placeholder='输入城市' />
                <datalist id='city-list' className='city-list'>
                    {cityList}
                </datalist>
            </div>
            <div className='positioning-div'>
                <MapPositioningSVG />
                <button className='positioning-btn'>定位当前位置</button>
            </div>
        </div>

        
    )
}