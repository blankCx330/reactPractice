import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type FavoritesCityList = {
  list: City[]
  addCity: (city: City) => void
  removeCity: (id: string) => void
  isInList: (id: string) => boolean
}

type City = {
  id: string
  name: string
  adm2: string
  lon: string
  lat: string
}
// set隐式的返回state对象
// get显示的返回get()对象
// state和get()实际上都返回了当前的状态对象
export const useFavoritesCityStore = create<FavoritesCityList>()(
  persist(
    (set, get) => ({
      list: [],
      addCity: (city: City) => {
        const currentList = get().list
        const exists = currentList.find(c => c.id === city.id)
        if (exists) return
        set({ list: [...currentList, city] })
      },
      removeCity: (id: string) => {
        set(state => ({list: state.list.filter(city => city.id !== id)}))
      }, 
      isInList: (id: string) => {
        return get().list.some(city => city.id === id) //find找到会返回id，未找到会返回undefinded
      }
    }),
    {
      name: 'favorites-city-list'
    }
  )
)
