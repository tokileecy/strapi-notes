import { useCallback } from 'react'

import { EditorCoreRef } from '../useMarkdown'
import * as fn from './fn'

const useHandleWrapSelection = (editorCoreRef: EditorCoreRef) => {
  return useCallback(() => {
    const finishedCallbacks: (() => void)[] = []
    let contentStatus = editorCoreRef.current.contentStatus
    const setContentStatus = editorCoreRef.current.setContentStatus

    contentStatus = fn.code(contentStatus, editorCoreRef)

    setContentStatus?.(contentStatus)

    return () => {
      finishedCallbacks.forEach((func) => {
        func()
      })
    }
  }, [editorCoreRef])
}

export default useHandleWrapSelection
