import { useCallback } from 'react'
import { EditorCoreRef } from '../useMarkdown'

const useHandleBackspace = (editorCoreRef: EditorCoreRef) => {
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

        const startStr = selectedStartLine.text.slice(0, start)

        const endStr = selectedStartLine.text.slice(
          end,
          selectedStartLine.text.length
        )

        let nextStr = ''

        if (start === end && start === 0) {
          let startIndex = 0

          for (let i = 0; i < contentLineIds.length; i++) {
            const id = contentLineIds[i]

            if (id === selectedStartLineId) {
              startIndex = i
              break
            }
          }

          if (startIndex !== 0) {
            const lastContentLineId = contentLineIds[startIndex - 1]
            const lastContentLineStr = contentLineById[lastContentLineId]

            nextStr = `${lastContentLineStr}${endStr}`

            setContentLineIds?.((prev) => {
              const nextLineIds = [...prev]

              nextLineIds.splice(startIndex, 1)
              return nextLineIds
            })
            setContentLineById?.((prev) => ({
              ...prev,
              [lastContentLineId]: { text: nextStr },
            }))

            finishedCallbacks.push(() => {
              const lastContainer = document.querySelector(
                `[data-id="${lastContentLineId}"] pre`
              )

              if (lastContainer?.childNodes[0]) {
                range.setStart(
                  lastContainer.childNodes[0],
                  lastContentLineStr.text.length
                )
                range.setEnd(
                  lastContainer.childNodes[0],
                  lastContentLineStr.text.length
                )
              }
            })
          }
        } else if (start === end) {
          nextStr = `${Array.from(startStr)
            .splice(0, startStr.length - 1)
            .join('')}${endStr}`

          setContentLineById?.((prev) => ({
            ...prev,
            [selectedStartLineId]: { text: nextStr },
          }))

          finishedCallbacks.push(() => {
            range.setStart(startContainer, start - 1)
            range.setEnd(startContainer, start - 1)
          })
        } else {
          nextStr = `${startStr}${endStr}`

          setContentLineById?.((prev) => ({
            ...prev,
            [selectedStartLineId]: { text: nextStr },
          }))

          finishedCallbacks.push(() => {
            range.setStart(startContainer, start)
            range.setEnd(startContainer, start)
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
        const startStr = selectedStartLine.text.slice(0, start)
        const selectedEndLine = contentLineById[selectedEndLineId]

        const endStr = selectedEndLine.text.slice(
          end,
          selectedEndLine.text.length
        )

        const nextStr = `${startStr}${endStr}`

        setContentLineIds?.((prev) => {
          const next = [...prev]

          next.splice(startIndex + 1, endIndex - startIndex)
          return next
        })
        setContentLineById?.((prev) => ({
          ...prev,
          [selectedStartLineId]: { text: nextStr },
        }))

        finishedCallbacks.push(() => {
          range.setStart(startContainer, start)
          range.setEnd(startContainer, start)
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

export default useHandleBackspace
