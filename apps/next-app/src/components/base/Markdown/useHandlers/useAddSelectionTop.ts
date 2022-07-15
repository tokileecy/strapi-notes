import { useCallback } from 'react'
import { EditorCoreRef } from '../useMarkdown'

const useAddHeshSelectionTop = (editorCoreRef: EditorCoreRef, str: string) => {
  return useCallback(() => {
    const finishedCallbacks: (() => void)[] = []

    const contentStatus = editorCoreRef.current.contentStatus
    const setContentStatus = editorCoreRef.current.setContentStatus

    const nextLineById = { ...contentStatus.lineById }

    contentStatus.lastSelectedLineIds.forEach((selectedLineId) => {
      const selectedLine = nextLineById[selectedLineId]

      nextLineById[selectedLineId].text = `${str}${selectedLine.text}`
      nextLineById[selectedLineId].start += str.length
      nextLineById[selectedLineId].end += str.length
    })

    setContentStatus?.({
      lineById: nextLineById,
    })

    return () => {
      finishedCallbacks.forEach((func) => {
        func()
      })
      editorCoreRef.current.cursorNeedUpdate = true
    }
  }, [editorCoreRef])
}

export default useAddHeshSelectionTop
