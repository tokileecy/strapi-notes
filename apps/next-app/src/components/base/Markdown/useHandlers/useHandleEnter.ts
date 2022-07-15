import { useCallback } from 'react'
import * as fn from './fn'
import { EditorCoreRef } from '../useMarkdown'

const useHandleEnter = (editorCoreRef: EditorCoreRef) => {
  return useCallback(() => {
    const setContentLineIds = editorCoreRef.current.setContentLineIds
    const setContentLineById = editorCoreRef.current.setContentLineById

    let next = {
      contentLineIds: editorCoreRef.current.contentLineIds,
      contentLineById: editorCoreRef.current.contentLineById,
      selectedEndLineId: editorCoreRef.current.selectedEndLineId,
      lastSelectedLineIds: editorCoreRef.current.lastSelectedLineIds,
    }

    next = fn.enter(editorCoreRef, next)

    setContentLineById?.(next.contentLineById)
    setContentLineIds?.(next.contentLineIds)

    return () => {
      editorCoreRef.current.selectedEndLineId = next.selectedEndLineId
      editorCoreRef.current.lastSelectedLineIds = next.lastSelectedLineIds
      editorCoreRef.current.cursorNeedUpdate = true
    }
  }, [editorCoreRef])
}

export default useHandleEnter
