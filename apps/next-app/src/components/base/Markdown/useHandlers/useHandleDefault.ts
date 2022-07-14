import { useCallback } from 'react'
import { EditorCoreRef } from '../useMarkdown'

const useHandleDefault = (editorCoreRef: EditorCoreRef) => {
  return useCallback(
    (key) => {
      const finishedCallbacks: (() => void)[] = []
      const selectedStartLineId = editorCoreRef.current.selectedStartLineId
      const selectedEndLineId = editorCoreRef.current.selectedEndLineId
      const contentLineById = editorCoreRef.current.contentLineById
      const contentLineIds = editorCoreRef.current.contentLineIds
      const setContentLineIds = editorCoreRef.current.setContentLineIds
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
          const endStr = selectedStartLine.slice(end, selectedStartLine.length)
          const nextStr = `${startStr}${key}${endStr}`

          setContentLineById?.((prev) => ({
            ...prev,
            [selectedStartLineId]: nextStr,
          }))

          finishedCallbacks.push(() => {
            if (selectedStartLine === '') {
              range.setStart(startContainer, 1)
              range.setEnd(startContainer, 1)
            } else {
              range.setStart(startContainer, start + 1)
              range.setEnd(startContainer, start + 1)
            }
          })
        } else if (selectedStartLineId !== '' && selectedEndLineId !== '') {
          let startIndex = 0
          let endIndex = 0

          for (let i = 0; i < contentLineIds.length; i++) {
            const id = contentLineIds[i]

            if (id === selectedStartLineId) {
              startIndex = i
            }

            if (id === selectedEndLineId) {
              endIndex = i
            }
          }

          const selectedStartLine = contentLineById[selectedStartLineId]
          const startStr = selectedStartLine.slice(0, start)
          const selectedEndLine = contentLineById[selectedEndLineId]
          const endStr = selectedEndLine.slice(end, selectedEndLine.length)

          const nextStr = `${startStr}${key}${endStr}`

          setContentLineIds?.((prev) => {
            const next = [...prev]

            next.splice(startIndex + 1, endIndex - startIndex)
            return next
          })
          setContentLineById?.((prev) => ({
            ...prev,
            [selectedStartLineId]: nextStr,
          }))

          finishedCallbacks.push(() => {
            range.setStart(startContainer, start + 1)
            range.setEnd(startContainer, start + 1)
          })
        }
      }

      return () => {
        finishedCallbacks.forEach((func) => {
          func()
        })
      }
    },
    [editorCoreRef]
  )
}

export default useHandleDefault
