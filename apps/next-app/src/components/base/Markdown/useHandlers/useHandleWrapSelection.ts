import { useCallback } from 'react'
import { EditorCoreRef } from '../useMarkdown'

const useHandleWrapSelection = (editorCoreRef: EditorCoreRef, str: string) => {
  return useCallback(() => {
    const finishedCallbacks: (() => void)[] = []

    const selectedStartLineId = editorCoreRef.current.selectedStartLineId
    const selectedEndLineId = editorCoreRef.current.selectedEndLineId
    const contentLineById = editorCoreRef.current.contentLineById
    const setContentLineById = editorCoreRef.current.setContentLineById

    const selection = window.getSelection()
    const range = selection?.getRangeAt(0)

    if (range) {
      const startContainer = range.startContainer
      const endContainer = range.endContainer
      const start = range.startOffset
      const end = range.endOffset

      if (startContainer === endContainer) {
        const selectedStartLine = contentLineById[selectedStartLineId]

        const startStr = selectedStartLine.slice(0, start)
        const centerStr = selectedStartLine.slice(start, end)
        const endStr = selectedStartLine.slice(end, selectedStartLine.length)
        const nextStr = `${startStr}${str}${centerStr}${str}${endStr}`

        setContentLineById?.((prev) => ({
          ...prev,
          [selectedStartLineId]: nextStr,
        }))

        finishedCallbacks.push(() => {
          range.setStart(startContainer, start + str.length)
          range.setEnd(startContainer, end + str.length)
        })
      } else if (selectedStartLineId !== '' && selectedEndLineId !== '') {
        const selectedStartLine = contentLineById[selectedStartLineId]
        const selectedEndLine = contentLineById[selectedEndLineId]

        const startBeforeStr = selectedStartLine.slice(0, start)

        const startAfterStr = selectedStartLine.slice(
          start,
          selectedStartLine.length
        )

        const endBeforeStr = selectedEndLine.slice(end, selectedEndLine.length)
        const endAfterStr = selectedEndLine.slice(end, selectedEndLine.length)
        const nextStartStr = `${startBeforeStr}${str}${startAfterStr}`
        const nextEndStr = `${endBeforeStr}${str}${endAfterStr}`

        setContentLineById?.((prev) => ({
          ...prev,
          [selectedStartLineId]: nextStartStr,
          [selectedEndLineId]: nextEndStr,
        }))

        finishedCallbacks.push(() => {
          range.setStart(startContainer, start + str.length)
          range.setEnd(startContainer, end)
        })
      }
    }

    return () => {
      finishedCallbacks.forEach((func) => {
        func()
      })
    }
  }, [])
}

export default useHandleWrapSelection
