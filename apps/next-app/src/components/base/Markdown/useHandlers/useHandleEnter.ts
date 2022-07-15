import { useCallback } from 'react'
import * as fn from './fn'
import { EditorCoreRef } from '../useMarkdown'

const useHandleEnter = (editorCoreRef: EditorCoreRef) => {
  return useCallback(() => {
    const setContentStatus = editorCoreRef.current.setContentStatus
    let contentStatus = editorCoreRef.current.contentStatus

    contentStatus = fn.enter(contentStatus, editorCoreRef)

    setContentStatus?.(contentStatus)

    return () => {
      editorCoreRef.current.cursorNeedUpdate = true
    }
  }, [editorCoreRef])
}

export default useHandleEnter
