import { useState, useEffect } from 'react'

type DebounceFn = (...rest: any) => void
export const useDebounce = (fn: DebounceFn, delay: number, deep:any[]) => {
  const [ debounceFn, setDebounceFn ] = useState<DebounceFn>()
  useEffect(() => {
    const time = setTimeout(() => {
      setDebounceFn(fn)
    }, delay)

    return () => {
      clearTimeout(time)
    }
  }, [ ...deep ])

  return debounceFn
}
