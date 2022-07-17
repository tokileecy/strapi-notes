import { useCallback, useRef } from 'react'

export interface CursorStatus {
  cursorNeedUpdate: boolean
}

const useCursor = () => {
  const cursorStatusRef = useRef<CursorStatus>({
    cursorNeedUpdate: false,
  })

  const cursorRef = useRef<HTMLDivElement>()

  const cursorRefCallback = useCallback((element: HTMLDivElement) => {
    if (cursorRef.current !== element) {
      cursorRef.current = element
    }
  }, [])

  return {
    cursorStatusRef,
    cursorRef,
    cursorRefCallback,
  }
}

export default useCursor
