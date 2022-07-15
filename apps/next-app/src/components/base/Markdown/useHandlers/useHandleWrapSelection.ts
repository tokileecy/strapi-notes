import { useCallback } from 'react'
import { EditorCoreRef } from '../useMarkdown'

const useHandleWrapSelection = (editorCoreRef: EditorCoreRef, str: string) => {
  return useCallback(() => {
    const finishedCallbacks: (() => void)[] = []

    const lastSelectedLineIds = editorCoreRef.current.lastSelectedLineIds
    const contentLineById = editorCoreRef.current.contentLineById
    const setContentLineById = editorCoreRef.current.setContentLineById

    const next = { ...contentLineById }

    if (lastSelectedLineIds.length === 1) {
      const selectedLineId = lastSelectedLineIds[0]
      const selectedLine = contentLineById[selectedLineId]

      const nextTextArr = Array.from(next[selectedLineId].text)

      nextTextArr.splice(selectedLine.start, 0, str)
      nextTextArr.splice(selectedLine.end + 1, 0, str)

      const nextText = nextTextArr.join('')

      next[selectedLineId].text = nextText
      next[selectedLineId].start += str.length
      next[selectedLineId].end += str.length
    } else {
      const startSelectedLineId = lastSelectedLineIds[0]

      const endSelectedLineId =
        lastSelectedLineIds[lastSelectedLineIds.length - 1]

      const startSelectedLine = contentLineById[startSelectedLineId]
      const endSelectedLine = contentLineById[endSelectedLineId]

      const nextStartTextArr = Array.from(startSelectedLine.text)
      const nextEndTextArr = Array.from(endSelectedLine.text)

      nextStartTextArr.splice(startSelectedLine.start, 0, str)
      nextEndTextArr.splice(endSelectedLine.end, 0, str)

      const nextStartText = nextStartTextArr.join('')
      const nextEndText = nextEndTextArr.join('')

      next[startSelectedLineId].text = nextStartText
      next[startSelectedLineId].start += str.length

      next[endSelectedLineId].text = nextEndText
    }

    setContentLineById?.(next)

    return () => {
      finishedCallbacks.forEach((func) => {
        func()
      })
      editorCoreRef.current.cursorNeedUpdate = true
    }
  }, [])
}

export default useHandleWrapSelection
