import { useCallback } from 'react'
import { EditorCoreRef } from '../useMarkdown'

const useHandleWrapSelection = (editorCoreRef: EditorCoreRef, str: string) => {
  return useCallback(() => {
    const finishedCallbacks: (() => void)[] = []

    const contentStatus = editorCoreRef.current.contentStatus
    const setContentStatus = editorCoreRef.current.setContentStatus

    const nextLineById = { ...contentStatus.lineById }

    if (contentStatus.lastSelectedLineIds.length === 1) {
      const selectedLineId = contentStatus.lastSelectedLineIds[0]
      const selectedLine = nextLineById[selectedLineId]

      const nextTextArr = Array.from(nextLineById[selectedLineId].text)

      nextTextArr.splice(selectedLine.start, 0, str)
      nextTextArr.splice(selectedLine.end + 1, 0, str)

      const nextText = nextTextArr.join('')

      nextLineById[selectedLineId].text = nextText
      nextLineById[selectedLineId].start += str.length
      nextLineById[selectedLineId].end += str.length
    } else {
      const startSelectedLineId = contentStatus.lastSelectedLineIds[0]

      const endSelectedLineId =
        contentStatus.lastSelectedLineIds[
          contentStatus.lastSelectedLineIds.length - 1
        ]

      const startSelectedLine = nextLineById[startSelectedLineId]
      const endSelectedLine = nextLineById[endSelectedLineId]

      const nextStartTextArr = Array.from(startSelectedLine.text)
      const nextEndTextArr = Array.from(endSelectedLine.text)

      nextStartTextArr.splice(startSelectedLine.start, 0, str)
      nextEndTextArr.splice(endSelectedLine.end, 0, str)

      const nextStartText = nextStartTextArr.join('')
      const nextEndText = nextEndTextArr.join('')

      nextLineById[startSelectedLineId].text = nextStartText
      nextLineById[startSelectedLineId].start += str.length

      nextLineById[endSelectedLineId].text = nextEndText
    }

    setContentStatus?.({
      lineById: nextLineById,
    })

    return () => {
      finishedCallbacks.forEach((func) => {
        func()
      })
      editorCoreRef.current.cursorNeedUpdate = true
    }
  }, [])
}

export default useHandleWrapSelection
