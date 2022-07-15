import { useCallback } from 'react'
import { EditorCoreRef } from '../useMarkdown'
import * as fn from './fn'

const useAddHeshToSelectionTop = (editorCoreRef: EditorCoreRef) => {
  return useCallback(() => {
    const finishedCallbacks: (() => void)[] = []

    let contentStatus = editorCoreRef.current.contentStatus
    const setContentStatus = editorCoreRef.current.setContentStatus

    contentStatus = fn.addHeshToTop(contentStatus)

    setContentStatus?.(contentStatus)

    return () => {
      finishedCallbacks.forEach((func) => {
        func()
      })
      editorCoreRef.current.cursorNeedUpdate = true
    }
  }, [editorCoreRef])
}

export default useAddHeshToSelectionTop
