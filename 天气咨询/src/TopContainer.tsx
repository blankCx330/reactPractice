import './topContainer.css'
import logo from './assets/logo.png'

const list = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '重庆', '西安 ']
const cityList = list.map(item => <option value={item} key={item} />)
export default function TopContainer() {
    return(
        <div className="topContainer">
            <img src={logo} alt="logo" className='logo'/>
            <input type='text' className='cityInput' list='cityList' placeholder='输入城市' />
            <datalist id='cityList'>
                {cityList}
            </datalist>
        </div>
    )
}