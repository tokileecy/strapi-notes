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

        const startStr = selectedStartLine.text.slice(0, start)
        const centerStr = selectedStartLine.text.slice(start, end)

        const endStr = selectedStartLine.text.slice(
          end,
          selectedStartLine.text.length
        )

        const nextStr = `${startStr}${str}${centerStr}${str}${endStr}`

        setContentLineById?.((prev) => ({
          ...prev,
          [selectedStartLineId]: { text: nextStr },
        }))

        finishedCallbacks.push(() => {
          range.setStart(startContainer, start + str.length)
          range.setEnd(startContainer, end + str.length)
        })
      } else if (selectedStartLineId !== '' && selectedEndLineId !== '') {
        const selectedStartLine = contentLineById[selectedStartLineId]
        const selectedEndLine = contentLineById[selectedEndLineId]

        const startBeforeStr = selectedStartLine.text.slice(0, start)

        const startAfterStr = selectedStartLine.text.slice(
          start,
          selectedStartLine.text.length
        )

        const endBeforeStr = selectedEndLine.text.slice(
          end,
          selectedEndLine.text.length
        )

        const endAfterStr = selectedEndLine.text.slice(
          end,
          selectedEndLine.text.length
        )

        const nextStartStr = `${startBeforeStr}${str}${startAfterStr}`
        const nextEndStr = `${endBeforeStr}${str}${endAfterStr}`

        setContentLineById?.((prev) => ({
          ...prev,
          [selectedStartLineId]: { text: nextStartStr },
          [selectedEndLineId]: { text: nextEndStr },
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
