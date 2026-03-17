import { useState } from "react"
import { useFavoritesCityStore } from "./hooks/useFavoritesCityStore"
import { useLocationStore } from "./hooks/useLocationStore"
import { FavoritesCityItem } from "./FavoritesCityItem"
import type { City } from "./types/qweather"
export default function FavoritesCityBtn() {

    const [isHide, setIsHide] = useState(true)
    const citys = useFavoritesCityStore(state => state.list)
    const removeCity = useFavoritesCityStore(state => state.removeCity)
    const setLocation = useLocationStore(state => state.setLocation)

    const handleCityClick = (city: City) => {
        setLocation({lon: city.lon, lat: city.lat})
        setIsHide(true)
    }
    const list = () => {
        if(isHide) return null
        if(!citys.length) return(
            <div className="min-w-[200px]  p-4 text-center mt-2 bg-black/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden z-50 favorites-list border border-white/80 ">
                暂无收藏城市
            </div>
        )
        return (<>
            <div className="mt-2 bg-black/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden z-50 favorites-list border border-white/80 ">
                <ul className="min-w-[200px] py-1">
                    {citys.map(city => 
                        <FavoritesCityItem
                            key={city.id} 
                            city={city} 
                            onClick={()=>handleCityClick(city)} 
                            onDelete={()=>removeCity(city.id)}
                        />
                    )}
                </ul>
            </div>
        </>)
    }

    const handleClick = () => {
        setIsHide(!isHide)
    }

    return (<>
        <div className=" favorites-btn">
            <button 
                className='flex items-center gap-x-1 text-xl font-semibold text-white active:scale-105 cursor-pointer'
                onClick={handleClick}
            >
            收藏列表
            <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" className="size-5 flex-none text-gray-500">
                <path d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
            </button>
            {list()}
        </div>
    </>)
}







