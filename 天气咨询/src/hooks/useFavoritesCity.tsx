import FavoritesCityList from "@/FavoritesCityList";
import { create } from "zustand";

type FavoritesCityList = {
    list: City[],
    addCity: (city: City) => void,
    removeCity: (id: string) => void,
    getLocation: (id: string) => {lon: number | undefined, lat: number | undefined},
    toggleFavorite: (id: string) => void
}

type City = {
    id: string,
    lon: number,
    lat: number,
    hasFavorite: boolean
}
// set隐式的返回state对象
// get显示的返回get()对象
// state和get()实际上都返回了当前的状态对象
export const useFavoritesCity = create<FavoritesCityList>((set,get)=>({
    list: [],
    addCity: (city:City) => {
        const currentList = get().list
        const exists = currentList.find(c => c.id === city.id)
        if(exists) return
        set({list: [...currentList, city]})
    },
    removeCity: (id : string) => {
        set(state => ({list: [...state.list.filter(c => c.id !== id)]}))
    },
    getLocation: (id: string) => {
        const city = get().list.find(c => c.id === id)
        return {lon: city?.lon, lat: city?.lat}
    },
    toggleFavorite: (id: string) => {
        set(state => ({
            list: state.list.map(c => (c.id === id ? {...c, hasFavorite: !c.hasFavorite} : c))
        }))
    }
}))