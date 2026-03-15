import './css/topContainer.css'
import logo from './assets/logo.png'
import Search from './iconSVG/Search'
import MapPositioningSVG from './iconSVG/MapPositioningSVG'
import { useState, useEffect, useRef } from 'react'
import { useLocationStore } from './hooks/useLocationStore'
import { useCityLocation } from './hooks/useCityLocation'
import { useUserLocation } from './hooks/useUserLocation'
import type { Location } from './types/qweather'
export default function TopContainer() {
  const [inputCityName, setInputCityName] = useState('')
  //用户选择框的选项列表
  const [showSuggestions, setShowSuggestions] = useState(false)

  const location = useLocationStore(state => state.location)
  const setLocation = useLocationStore(state => state.setLocation)

  //获取搜索的城市坐标
  const { data: getCityLocation, isLoading: cityLocationIsLoading } = useCityLocation(inputCityName)

  const {
    data: userLocation,
    isLoading: userLocationloading,
    isError: userLocationIsError,
  } = useUserLocation()

  const setCityLocation = () => {
    const lon = getCityLocation?.location[0].lon
    const lat = getCityLocation?.location[0].lat
    if (getCityLocation && lon && lat) setLocation({ lon, lat })
    // onLocationChange(getCityLocation.location[0].lon, getCityLocation.location[0].lat)
  }

  const suggestionsListText = () => {
    if (!showSuggestions || !inputCityName) return null

    if (cityLocationIsLoading) {
      return (
        <div className="suggestions-list">
          <div className="suggestion-item">搜索中...</div>
        </div>
      )
    }

    //记得加"!",不然下面的.map()对null/undefined调用会抛出 JavaScript 错误，React 组件崩溃
    if (!getCityLocation?.location?.length) {
      return (
        <div className="suggestions-list">
          <div className="suggestion-item">未找到匹配城市</div>
        </div>
      )
    }

    return (
      <div className="suggestions-list">
        {getCityLocation?.location.map(data => (
          <div key={data.id} className="suggestion-item" onClick={() => handleListOnClick(data)}>
            {data.adm2} - {data.name} - {data.adm1}
          </div>
        ))}
      </div>
    )
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') setCityLocation()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputCityName(e.target.value)
    setShowSuggestions(true)
  }
  const handleListOnClick = (data: Location) => {
    setInputCityName(data.name)
    setShowSuggestions(false)
    setLocation({ lon: data.lon, lat: data.lat })
  }
  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 100)
  }
  const handleUserCurrentLoaction = () => {
    if (userLocation) setLocation({ lon: userLocation.lon, lat: userLocation.lat })
    setInputCityName('')
  }
  const positioningText = () => {
    if (userLocationloading) return '定位中...'
    if (userLocationIsError) return '定位失败'
    return '定位当前位置'
  }

  // 移除
  // const cityList = topCityList.map(city => {
  //     return <option key={city.id} value={city.name} />
  // })

  return (
    <div className="top-container">
      <img src={logo} alt="logo" className="logo" />
      <div className="input-div">
        <Search />
        <input
          type="text"
          className="city-input"
          list="city-list"
          placeholder="输入城市"
          value={inputCityName}
          onKeyDown={e => onKeyDown(e)}
          onChange={e => handleInputChange(e)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={handleBlur}
        />
        {suggestionsListText()}
        {/*
                移除
                 <datalist id='city-list' className='city-list'>
                    {cityList}
                </datalist> */}
      </div>
      <div className="positioning-div" onClick={handleUserCurrentLoaction}>
        <MapPositioningSVG />
        <button className="positioning-btn">{positioningText()}</button>
      </div>
    </div>
  )
}
