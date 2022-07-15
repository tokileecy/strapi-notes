import { useCallback } from 'react'
import { EditorCoreRef } from '../useMarkdown'

const useAddHeshSelectionTop = (editorCoreRef: EditorCoreRef, str: string) => {
  return useCallback(() => {
    const finishedCallbacks: (() => void)[] = []
    const lastSelectedLineIds = editorCoreRef.current.lastSelectedLineIds
    const contentLineById = editorCoreRef.current.contentLineById
    const setContentLineById = editorCoreRef.current.setContentLineById

    const next = { ...contentLineById }

    lastSelectedLineIds.forEach((selectedLineId) => {
      const selectedLine = contentLineById[selectedLineId]

      next[selectedLineId].text = `${str}${selectedLine.text}`
      next[selectedLineId].start += str.length
      next[selectedLineId].end += str.length
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

export default useAddHeshSelectionTop
