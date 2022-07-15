import { useCallback } from 'react'
import { EditorCoreRef } from '../useMarkdown'

const useAddHeshToSelectionTop = (editorCoreRef: EditorCoreRef) => {
  return useCallback(() => {
    const finishedCallbacks: (() => void)[] = []
    const lastSelectedLineIds = editorCoreRef.current.lastSelectedLineIds
    const contentLineById = editorCoreRef.current.contentLineById
    const setContentLineById = editorCoreRef.current.setContentLineById

    const next = { ...contentLineById }

    lastSelectedLineIds.forEach((selectedLineId) => {
      const selectedLine = contentLineById[selectedLineId]

      let targetToAdd = '#'

      if (selectedLine.text[0] !== '#') {
        targetToAdd += ' '
      }

      next[selectedLineId].text = `${targetToAdd}${selectedLine.text}`
      next[selectedLineId].start += targetToAdd.length
      next[selectedLineId].end += targetToAdd.length
    })

    setContentLineById?.(next)

    return () => {
      finishedCallbacks.forEach((func) => {
        func()
      })
      editorCoreRef.current.cursorNeedUpdate = true
    }
  }, [editorCoreRef])
}

export default useAddHeshToSelectionTop
