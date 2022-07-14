import { useCallback } from 'react'
import { EditorCoreRef } from '../useMarkdown'

const useAddHeshToSelectionTop = (editorCoreRef: EditorCoreRef) => {
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
        let targetToAdd = '#'

        if (selectedStartLine[0] !== '#') {
          targetToAdd += ' '
        }

        setContentLineById?.((prev) => ({
          ...prev,
          [selectedStartLineId]: `${targetToAdd}${selectedStartLine}`,
        }))

        finishedCallbacks.push(() => {
          range.setStart(
            startContainer,
            selectedStartLine.length + targetToAdd.length
          )
          range.setEnd(
            startContainer,
            selectedStartLine.length + targetToAdd.length
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

        const finishedSelectionOffset = {
          start: 1,
          end: 1,
        }

        setContentLineById?.((prev) => {
          const target: Record<string, string> = {}

          for (let i = startIndex; i <= endIndex; i++) {
            const lineId = contentLineIds[i]
            const contentLine = contentLineById[lineId]

            let targetToAdd = '#'

            if (contentLine[0] !== '#') {
              if (i === startIndex) {
                finishedSelectionOffset.start = 2
              }

              if (i === endIndex) {
                finishedSelectionOffset.end = 2
              }

              targetToAdd += ' '
            }

            target[lineId] = `${targetToAdd}${contentLine}`
          }

          return {
            ...prev,
            ...target,
          }
        })

        finishedCallbacks.push(() => {
          range.setStart(startContainer, start + finishedSelectionOffset.start)
          range.setEnd(endContainer, end + finishedSelectionOffset.end)
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

export default useAddHeshToSelectionTop
