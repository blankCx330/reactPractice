import './css/topContainer.css'
import logo from './assets/logo.png'
import Search from './iconSVG/Search'
import MapPositioningSVG from './iconSVG/MapPositioningSVG'
import { useState, useEffect, useRef } from 'react'
import { useQuery } from "@tanstack/react-query"
import type { TopCityResponse, PoiLookupResponse, CityLookupResponse } from './types/qweather'
export default function TopContainer({topCityList, userLocation, onLocationChange}: {topCityList: TopCityResponse['topCityList'], userLocation?: any, onLocationChange: (lon: number, lat: number) => void}) {
    
    const apiHost = import.meta.env.VITE_API_HOST
    const apiKey = import.meta.env.VITE_API_KEY

    const [inputCityName, setInputCityName] = useState('')
    //用户选择框的选项列表
    const [showSuggestions, setShowSuggestions] = useState(false)

    //获取搜索的城市坐标
    const {data: getCityLocation} = useQuery<PoiLookupResponse | null>({
        queryKey: ['searchedCityLocation', inputCityName],
        queryFn: async () => {
            const searchedUrl = `https://${apiHost}/geo/v2/poi/lookup?type=scenic&location=${inputCityName}&key=${apiKey}`
            console.log('触发辣！')
            return fetch(searchedUrl).then(res => res.json())
        },
        enabled: inputCityName.length > 1 // 初始不执行查询，等到用户输入后再执行
    })
    console.log("搜索的城市坐标", getCityLocation)
    const setCityLocation = () => {
        if(getCityLocation)
            onLocationChange(getCityLocation.poi[0].lon, getCityLocation.poi[0].lat)
        console.log('经纬度', getCityLocation?.poi[0].lon, getCityLocation?.poi[0].lat)
    }

    const onKeyDown = (e : React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter')
            setCityLocation()
    }
    const handleBlur = () => {
        setTimeout(() => setShowSuggestions(false), 100)
    }

    // 移除
    // const cityList = topCityList.map(city => {
    //     return <option key={city.id} value={city.name} />
    // })
    
    return(
        <div className="top-container">
            <img src={logo} alt="logo" className='logo'/>
            <div className='input-div'>
                <Search />
                <input
                    type='text' 
                    className='city-input' 
                    list='city-list' 
                    placeholder='输入城市'
                    value={inputCityName}
                    // onClick={() => setInputCityName('')}
                    onKeyDown={(e) => onKeyDown(e)}
                    onChange={(e) => {
                        setInputCityName(e.target.value)
                        setShowSuggestions(true)
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={handleBlur}
                />
                {showSuggestions && getCityLocation?.poi?.length && (
                    <div className='suggestions-list'>
                        {getCityLocation?.poi?.map((data: any) => (
                            <div
                                key={data.id}
                                className='suggestion-item'
                                onClick={() => {
                                    setInputCityName(data.name)
                                    setShowSuggestions(false)
                                    onLocationChange(data.lon, data.lat)
                                }}
                            >
                                {data.adm2} - {data.name} - {data.adm1}
                            </div>
                        ))}
                    </div>
                )}
                {/*
                移除
                 <datalist id='city-list' className='city-list'>
                    {cityList}
                </datalist> */}
            </div>
            <div className='positioning-div'>
                <MapPositioningSVG />
                <button 
                    className='positioning-btn'
                    onClick={()=>{
                        onLocationChange(userLocation.lon, userLocation.lat)
                        setInputCityName('')
                    }}
                >定位当前位置</button>
            </div>
        </div>

        
    )
}