import { useCallback } from 'react'
import * as fn from './fn'
import { EditorCoreRef } from '../useMarkdown'

const useHandleBackspace = (editorCoreRef: EditorCoreRef) => {
  return useCallback(() => {
    let contentStatus = editorCoreRef.current.contentStatus
    const setContentStatus = editorCoreRef.current.setContentStatus

    contentStatus = fn.backspace(editorCoreRef, contentStatus)

    setContentStatus?.(contentStatus)

    return () => {
      editorCoreRef.current.cursorNeedUpdate = true
    }
  }, [editorCoreRef])
}

export default useHandleBackspace
