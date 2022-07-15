import { useCallback } from 'react'
import { EditorCoreRef } from '../useMarkdown'

const useAddHeshToSelectionTop = (editorCoreRef: EditorCoreRef) => {
  return useCallback(() => {
    const finishedCallbacks: (() => void)[] = []

    const contentStatus = editorCoreRef.current.contentStatus
    const setContentStatus = editorCoreRef.current.setContentStatus

    const nextLineById = { ...contentStatus.lineById }

    contentStatus.lastSelectedLineIds.forEach((selectedLineId) => {
      const selectedLine = nextLineById[selectedLineId]

      let targetToAdd = '#'

      if (selectedLine.text[0] !== '#') {
        targetToAdd += ' '
      }

      nextLineById[selectedLineId].text = `${targetToAdd}${selectedLine.text}`
      nextLineById[selectedLineId].start += targetToAdd.length
      nextLineById[selectedLineId].end += targetToAdd.length
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

export default useAddHeshToSelectionTop
