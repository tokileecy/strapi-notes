import { useCallback } from 'react'
import { EditorCoreRef } from '../useMarkdown'
import { wrapSelection } from './fn'

const useHandleWrapSelection = (editorCoreRef: EditorCoreRef, str: string) => {
  return useCallback(() => {
    const finishedCallbacks: (() => void)[] = []

    let contentStatus = editorCoreRef.current.contentStatus
    const setContentStatus = editorCoreRef.current.setContentStatus

    contentStatus = wrapSelection(contentStatus, str)

    setContentStatus?.(contentStatus)

    return () => {
      finishedCallbacks.forEach((func) => {
        func()
      })
      editorCoreRef.current.cursorNeedUpdate = true
    }
  }, [])
}

export default useHandleWrapSelection
