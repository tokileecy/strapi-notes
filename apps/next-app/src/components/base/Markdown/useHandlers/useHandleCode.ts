import { useCallback } from 'react'
import { nanoid } from 'nanoid'
import { EditorCoreRef } from '../useMarkdown'

const useHandleWrapSelection = (editorCoreRef: EditorCoreRef) => {
  return useCallback(() => {
    const finishedCallbacks: (() => void)[] = []

    const selectedStartLineId = editorCoreRef.current.selectedStartLineId
    const selectedEndLineId = editorCoreRef.current.selectedEndLineId
    const contentLineIds = editorCoreRef.current.contentLineIds
    const contentLineById = editorCoreRef.current.contentLineById
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

        const startStr = selectedStartLine.text.slice(0, start)
        const centerStr = selectedStartLine.text.slice(start, end)

        const endStr = selectedStartLine.text.slice(
          end,
          selectedStartLine.text.length
        )

        const nextStr = `${startStr}\`${centerStr}\`${endStr}`

        setContentLineById?.((prev) => ({
          ...prev,
          [selectedStartLineId]: {
            text: nextStr,
          },
        }))

        finishedCallbacks.push(() => {
          range.setStart(startContainer, start + 1)
          range.setEnd(startContainer, end + 1)
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

        const topId = nanoid(6)
        const bottomId = nanoid(6)

        setContentLineIds?.((prev) => {
          const nextLineIds = [...prev]

          nextLineIds.splice(startIndex, 0, topId)
          nextLineIds.splice(endIndex + 2, 0, bottomId)
          return nextLineIds
        })

        setContentLineById?.((prev) => ({
          ...prev,
          [topId]: {
            text: '```',
          },
          [bottomId]: {
            text: '```',
          },
        }))

        finishedCallbacks.push(() => {
          const topContainerElement = document.querySelector(
            `[data-id="${selectedStartLineId}"] pre`
          )

          const bottomContainerElement = document.querySelector(
            `[data-id="${selectedEndLineId}"] pre`
          )

          if (topContainerElement?.childNodes[0]) {
            range.setStart(topContainerElement.childNodes[0], start)
          }

          if (bottomContainerElement?.childNodes[0]) {
            range.setEnd(bottomContainerElement.childNodes[0], end)
          }
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
