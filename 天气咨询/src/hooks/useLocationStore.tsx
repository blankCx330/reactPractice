import { create } from 'zustand'

type Location = { lon: number; lat: number }

type LocationStore = {
  location: Location
  setLocation: (loc: Location) => void
}

export const useLocationStore = create<LocationStore>(set => ({
  location: { lon: 116, lat: 40 },
  setLocation: (newLocation: Location) => set({ location: newLocation }),
}))
