import { Dispatch, useMemo, useRef } from 'react'
import {
  ContentStatus,
  initialContentStatus,
  LineState,
} from './useContentStatus'

const maxCacheCount = 50

export interface Revision {
  startOffset: number
  endOffset: number
  selectedStartLineId: string
  selectedEndLineId: string
  contentLineIds: string[]
  contentLineById: Record<string, LineState>
}

const useHistoryHandlers = (
  contentStatus: ContentStatus,
  setContentStatus: Dispatch<Partial<ContentStatus>>
) => {
  const previousRevisionRef = useRef<Revision[]>([])

  const contentStatusRef = useRef<{
    contentStatus: ContentStatus
  }>({
    contentStatus: { ...initialContentStatus },
  })

  contentStatusRef.current.contentStatus = contentStatus

  return useMemo(() => {
    const saveState = () => {
      const contentStatus = contentStatusRef.current.contentStatus

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
        selectedStartLineId =
          contentStatus.ids[contentStatus.selectedRange.start]
        selectedEndLineId = contentStatus.ids[contentStatus.selectedRange.end]
      }

      previousRevisionRef.current.push({
        startOffset,
        endOffset,
        selectedStartLineId,
        selectedEndLineId,
        contentLineIds: contentStatus.ids,
        contentLineById: contentStatus.lineById,
      })
    }

    const handleUndo = () => {
      const previousRevision = previousRevisionRef.current

      if (previousRevision.length > 0) {
        const prevContext = previousRevision.pop()

        if (prevContext) {
          const nextContentLineIds = [...prevContext.contentLineIds]

          const nextContentLineById = {
            ...prevContext.contentLineById,
          }

          setContentStatus({
            actionHistory: ['undo'],
            ids: nextContentLineIds,
            lineById: nextContentLineById,
          })

          return () => {
            if (
              !(
                contentStatusRef.current.contentStatus.ids ===
                nextContentLineIds
              ) ||
              !(
                contentStatusRef.current.contentStatus.lineById ===
                nextContentLineById
              )
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
  }, [])
}

export type HistoryHandlers = ReturnType<typeof useHistoryHandlers>

export default useHistoryHandlers
