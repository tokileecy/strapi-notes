import { useCallback } from 'react'
import { nanoid } from 'nanoid'
import { EditorCoreRef } from '../useMarkdown'

const useHandleEnter = (editorCoreRef: EditorCoreRef) => {
  return useCallback(() => {
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

        let selectContentIndex = 0

        for (let i = 0; i < contentLineIds.length; i++) {
          const id = contentLineIds[i]

          if (id === selectedStartLineId) {
            selectContentIndex = i
            break
          }
        }

        if (start === end && start === 0) {
          const id = nanoid(6)

          setContentLineIds?.((prev) => {
            const nextLineIds = [...prev]

            nextLineIds.splice(selectContentIndex, 0, id)
            return nextLineIds
          })
          setContentLineById?.((prev) => ({
            ...prev,
            [id]: '',
          }))

          finishedCallbacks.push(() => {
            range.setStart(startContainer, start)
            range.setEnd(startContainer, start)
          })
        } else {
          const id = nanoid(6)

          setContentLineIds?.((prev) => {
            const nextLineIds = [...prev]

            nextLineIds.splice(selectContentIndex + 1, 0, id)
            return nextLineIds
          })

          setContentLineById?.((prev) => ({
            ...prev,
            [selectedStartLineId]: startStr,
            [id]: endStr,
          }))

          finishedCallbacks.push(() => {
            const newContainer = document.querySelector(`[data-id="${id}"] pre`)

            if (newContainer?.childNodes[0]) {
              range.setStart(newContainer.childNodes[0], 0)
              range.setEnd(newContainer.childNodes[0], 0)
            }
          })
        }
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

        setContentLineIds?.((prev) => {
          const next = [...prev]

          next.splice(startIndex + 1, endIndex - startIndex - 1)
          return next
        })
        setContentLineById?.((prev) => ({
          ...prev,
          [selectedStartLineId]: startStr,
          [selectedEndLineId]: endStr,
        }))

        finishedCallbacks.push(() => {
          range.setStart(endContainer, 0)
          range.setEnd(endContainer, 0)
        })
      }
    }

    return () => {
      finishedCallbacks.forEach((func) => {
        func()
      })
    }
  }, [editorCoreRef])
}

export default useHandleEnter
