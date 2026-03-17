import type { City } from "./types/qweather"

interface Props {
  city: City
  onClick: () => void
  onDelete: () => void
}

export function FavoritesCityItem({city, onClick, onDelete}: Props) {

  return <>
    <li 
      className="px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors"
      onClick={onClick}
    >
    <span className="w-3/4 text-center hover:bg-white/50 rounded-lg">{city.adm2}-{city.name}</span>
    <button 
      className="rounded-lg w-1/4 hover:bg-red-500 cursor-pointer"  
      onClick={(e) =>{
        e.stopPropagation()
        onDelete()
      }} 
      aria-label="删除收藏"
    >
      删除
    </button>
  </li>
  </>
}
