import './topContainer.css'
import logo from './assets/logo.png'
import Search from './Search'
import MapPositioningSVG from './MapPositioningSVG'

const list = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '重庆', '西安 ']
const cityList = list.map(item => <option value={item} key={item} />)
export default function TopContainer() {
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