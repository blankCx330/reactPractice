import { useState, useEffect } from 'react'

export const useDebouncedValue = (name: string, time: number) => {
  const [debounced, setDebounced] = useState(name)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(name), time)
    return () => clearTimeout(timer)
  }, [name, time])

  return debounced
}
