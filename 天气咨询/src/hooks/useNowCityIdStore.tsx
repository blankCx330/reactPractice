import { create } from "zustand";

type CityId = {
    cityId: string
    setCityId: (id: string) => void
}
export const useNowCityIdStore = create<CityId>((set)=>({
    cityId: '',
    setCityId: (id: string) => set({cityId: id})
}))