import { useCallback, useRef } from 'react'

const useCursor = () => {
  const cursorRef = useRef<HTMLDivElement>()

  const cursorRefCallback = useCallback((element: HTMLDivElement) => {
    if (cursorRef.current !== element) {
      cursorRef.current = element
    }
  }, [])

  return {
    cursorRef,
    cursorRefCallback,
  }
}

export default useCursor
