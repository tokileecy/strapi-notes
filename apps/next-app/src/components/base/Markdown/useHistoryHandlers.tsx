import { useMemo, useRef } from 'react'
import { EditorCoreRef } from './useMarkdown'

const maxCacheCount = 50

export interface Revision {
  startOffset: number
  endOffset: number
  selectedStartLineId: string
  selectedEndLineId: string
  contentLineIds: string[]
  contentLineById: Record<string, string>
}

const useHistoryHandlers = (editorCoreRef: EditorCoreRef) => {
  const previousRevisionRef = useRef<Revision[]>([])

  return useMemo(() => {
    const saveState = () => {
      if (editorCoreRef.current) {
        if (previousRevisionRef.current.length > maxCacheCount) {
          previousRevisionRef.current.shift()
        }

        const range = window.getSelection()?.getRangeAt(0)
        let startOffset = 0
        let endOffset = 0
        let selectedStartLineId = ''
        let selectedEndLineId = ''

        if (range) {
          startOffset = range.startOffset
          endOffset = range.endOffset
          selectedStartLineId = editorCoreRef.current.selectedStartLineId
          selectedEndLineId = editorCoreRef.current.selectedEndLineId
        }

        previousRevisionRef.current.push({
          startOffset,
          endOffset,
          selectedStartLineId,
          selectedEndLineId,
          contentLineIds: editorCoreRef.current.contentLineIds,
          contentLineById: editorCoreRef.current.contentLineById,
        })
      }
    }

    const handleUndo = () => {
      const previousRevision = previousRevisionRef.current

      if (previousRevision.length > 0) {
        const prevContext = previousRevision.pop()

        if (prevContext && editorCoreRef.current) {
          const nextContentLineIds = [...prevContext.contentLineIds]

          const nextContentLineById = {
            ...prevContext.contentLineById,
          }

          editorCoreRef.current.setContentLineIds?.(nextContentLineIds)
          editorCoreRef.current.setContentLineById?.(nextContentLineById)

          return () => {
            if (
              !(editorCoreRef.current.contentLineIds === nextContentLineIds) ||
              !(editorCoreRef.current.contentLineById === nextContentLineById)
            ) {
              throw new Error('not metch') // TODO
            } else {
              const range = window.getSelection()?.getRangeAt(0)

              if (range) {
                const startContainer = document.querySelector(
                  `[data-id="${prevContext.selectedStartLineId}"] pre`
                )

                const endContainer = document.querySelector(
                  `[data-id="${prevContext.selectedEndLineId}"] pre`
                )

                if (
                  startContainer?.childNodes[0] &&
                  endContainer?.childNodes[0]
                ) {
                  range.setStart(
                    startContainer.childNodes[0],
                    prevContext.startOffset
                  )
                  range.setEnd(
                    endContainer.childNodes[0],
                    prevContext.endOffset
                  )
                }
              }
            }
          }
        }
      }

      return () => {
        return null
      }
    }

    const clearHistory = () => {
      previousRevisionRef.current.length = 0
    }

    return { saveState, handleUndo, clearHistory }
  }, [previousRevisionRef, editorCoreRef])
}

export type HistoryHandlers = ReturnType<typeof useHistoryHandlers>

export default useHistoryHandlers
