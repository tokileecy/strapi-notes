import { useCallback } from 'react'
import * as fn from './fn'
import { EditorCoreRef } from '../useMarkdown'

const useHandleEnter = (editorCoreRef: EditorCoreRef) => {
  return useCallback(
    (direction: 'UP' | 'DOWN' | 'RIGHT' | 'LEFT') => {
      let contentStatus = editorCoreRef.current.contentStatus
      const setContentStatus = editorCoreRef.current.setContentStatus

      contentStatus = fn.arrow(contentStatus, editorCoreRef, direction)

      setContentStatus?.(contentStatus)

      return () => {
        editorCoreRef.current.cursorNeedUpdate = true
      }
    },
    [editorCoreRef]
  )
}

export default useHandleEnter
