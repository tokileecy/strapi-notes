import { useEffect, useRef } from 'react'

export type FrameUpdateEvent = 'frame'

export interface FrameLoopStatus {
  queue: Record<FrameUpdateEvent, Set<() => void>>
  on: (event: FrameUpdateEvent, callback: () => void) => void
  off: (event: FrameUpdateEvent, callback: () => void) => void
}

const useFrameLoop = () => {
  const frameUpdateStatusRef = useRef<FrameLoopStatus>({
    queue: {
      'frame': new Set(),
    },
    on(event: FrameUpdateEvent, callback: () => void) {
      this.queue[event].add(callback)
    },
    off(event: FrameUpdateEvent, callback: () => void) {
      this.queue[event].delete(callback)
    },
  })

  const frameIdRef = useRef<number>()

  useEffect(() => {
    const update = () => {
      frameUpdateStatusRef.current.queue.frame.forEach((callback) => {
        callback()
      })

      frameIdRef.current = requestAnimationFrame(update)
    }

    try {
      update()
    } catch (error) {
      console.error(error)
    }

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current)
      }
    }
  }, [])

  return frameUpdateStatusRef
}

export default useFrameLoop
