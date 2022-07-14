import { useCallback } from 'react'
import { EditorCoreRef, LineState } from '../useMarkdown'

const useAddHeshSelectionTop = (editorCoreRef: EditorCoreRef, str: string) => {
  return useCallback(() => {
    const finishedCallbacks: (() => void)[] = []
    const selectedStartLineId = editorCoreRef.current.selectedStartLineId
    const selectedEndLineId = editorCoreRef.current.selectedEndLineId
    const contentLineById = editorCoreRef.current.contentLineById
    const contentLineIds = editorCoreRef.current.contentLineIds
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

        setContentLineById?.((prev) => ({
          ...prev,
          [selectedStartLineId]: { text: `${str}${selectedStartLine}` },
        }))

        finishedCallbacks.push(() => {
          range.setStart(
            startContainer,
            selectedStartLine.text.length + str.length
          )
          range.setEnd(
            startContainer,
            selectedStartLine.text.length + str.length
          )
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

        setContentLineById?.((prev) => {
          const target: Record<string, LineState> = {}

          for (let i = startIndex; i <= endIndex; i++) {
            const lineId = contentLineIds[i]
            const contentLine = contentLineById[lineId]

            target[lineId] = {
              text: `${str}${contentLine}`,
            }
          }

          return {
            ...prev,
            ...target,
          }
        })

        finishedCallbacks.push(() => {
          range.setStart(startContainer, start + str.length)
          range.setEnd(startContainer, end + str.length)
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

export default useAddHeshSelectionTop
