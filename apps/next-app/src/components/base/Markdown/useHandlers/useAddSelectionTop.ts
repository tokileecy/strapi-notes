import { useCallback } from 'react'
import { EditorCoreRef } from '../useMarkdown'
import * as fn from './fn'

const useAddHeshSelectionTop = (editorCoreRef: EditorCoreRef, str: string) => {
  return useCallback(() => {
    const finishedCallbacks: (() => void)[] = []

    let contentStatus = editorCoreRef.current.contentStatus
    const setContentStatus = editorCoreRef.current.setContentStatus

    contentStatus = fn.addStrToSelectionTop(contentStatus, str)

    setContentStatus?.(contentStatus)

    return () => {
      finishedCallbacks.forEach((func) => {
        func()
      })
      editorCoreRef.current.cursorNeedUpdate = true
    }
  }, [editorCoreRef])
}

export default useAddHeshSelectionTop
