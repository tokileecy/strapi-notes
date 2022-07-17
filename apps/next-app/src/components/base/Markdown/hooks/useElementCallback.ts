import { useCallback, useRef } from 'react'

const useElementCallback = <T>() => {
  const elementRef = useRef<T>()

  const elementRefCallback = useCallback((element: T) => {
    if (elementRef.current !== element) {
      elementRef.current = element
    }
  }, [])

  return [elementRef, elementRefCallback] as const
}

export default useElementCallback
