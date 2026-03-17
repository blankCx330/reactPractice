import { create } from 'zustand'

type Location = { lon: string | null; lat: string | null }

type LocationStore = {
  location: Location
  setLocation: (loc: Location) => void
}

export const useLocationStore = create<LocationStore>(set => ({
  location: { lon: null, lat: null },
  setLocation: (newLocation: Location) => set({ location: newLocation }),
}))
