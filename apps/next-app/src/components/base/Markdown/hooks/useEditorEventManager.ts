import { MutableRefObject, useEffect, useMemo, useRef } from 'react'
import { Handlers } from './useHandlers'
import { HistoryHandlers } from './useHistoryHandlers'
import {
  getChangeSelectLinesOptionsByRange,
  refreshCursorByElement,
  refreshCursorBySelection,
} from '../utils'
import { ContentStatus, initialContentStatus } from './useContentStatus'
import { CursorStatus } from './useCursor'
import { DocumentStatusRef } from './useDodumentEvent'

export type EditorCommend = 'bold' | 'italic' | 'strike' | 'header' | 'code'

export interface EditorCommendEvent {
  type: 'commend'
  commend?: EditorCommend
}

export interface InputCommendEvent {
  type: 'input'
  value?: string
}

export type EditorEvent = EditorCommendEvent | InputCommendEvent

const useEditorEventManager = (
  editorDivRef: MutableRefObject<HTMLDivElement | undefined>,
  documentStatusRef: DocumentStatusRef,
  cursorRef: MutableRefObject<HTMLDivElement | undefined>,
  textareaRef: MutableRefObject<HTMLTextAreaElement | undefined>,
  cursorStatusRef: MutableRefObject<CursorStatus>,
  handlers: Handlers,
  historyHandlers: HistoryHandlers,
  contentStatus: ContentStatus
) => {
  const eventsQueueRef = useRef<EditorEvent[]>([])

  const frameIdRef = useRef<number>()

  const contentStatusRef = useRef<{
    contentStatus: ContentStatus
  }>({
    contentStatus: { ...initialContentStatus },
  })

  contentStatusRef.current.contentStatus = contentStatus

  useEffect(() => {
    const update = () => {
      if (documentStatusRef.current.isSelectionChange) {
        if (
          editorDivRef?.current &&
          cursorRef.current &&
          documentStatusRef.current.lastSelectionRange
        ) {
          const range = new Range()

          range.setStart(
            documentStatusRef.current.lastSelectionRange.endContainer,
            documentStatusRef.current.lastSelectionRange.endOffset
          )

          refreshCursorBySelection(
            editorDivRef.current,
            cursorRef.current,
            range
          )
        }
      }

      if (cursorStatusRef.current.cursorNeedUpdate) {
        try {
          if (editorDivRef.current && cursorRef.current) {
            const contentStatus = contentStatusRef.current.contentStatus

            if (contentStatus.selectedRange.end !== -1) {
              const selectedEndLineId =
                contentStatus.ids[contentStatus.selectedRange.end]

              const selectedEndLineElement = document.querySelector(
                `[data-id="${selectedEndLineId}"] pre`
              ) as HTMLElement

              const centerElement = selectedEndLineElement.querySelector(
                `[data-type="line-center"]`
              ) as HTMLElement

              const editorElement = document.querySelector(
                '[data-type="editor"]'
              )

              if (editorElement && selectedEndLineElement) {
                const scrollBottom =
                  editorElement.scrollTop + editorElement.clientHeight

                const editorStyles = window.getComputedStyle(editorElement)

                const seenableBootom =
                  selectedEndLineElement.offsetTop +
                  selectedEndLineElement.offsetHeight +
                  parseInt(editorStyles.paddingTop)

                const seenableTop =
                  selectedEndLineElement.offsetTop +
                  parseInt(editorStyles.paddingTop)

                const scrollTop = editorElement.scrollTop

                if (seenableBootom > scrollBottom) {
                  editorElement.scrollTop += seenableBootom - scrollBottom
                }

                if (seenableTop < scrollTop) {
                  editorElement.scrollTop -= scrollTop - seenableTop
                }
              }

              refreshCursorByElement(
                editorDivRef.current,
                cursorRef.current,
                centerElement
              )
            }
          }
        } catch (error) {
          console.error(error)
        }

        cursorStatusRef.current.cursorNeedUpdate = false
      }

      if (
        documentStatusRef.current.isMouseDown &&
        !documentStatusRef.current.prevIsMouseDown
      ) {
        const lastSelectionRange = documentStatusRef.current.lastSelectionRange

        if (lastSelectionRange) {
          handlers.handleChangeSelectLines(
            getChangeSelectLinesOptionsByRange(
              contentStatusRef.current.contentStatus.ids,
              lastSelectionRange
            ),
            {
              cursorNeedUpdate: true,
            }
          )
        }
      }

      if (
        !documentStatusRef.current.isMouseDown &&
        documentStatusRef.current.prevIsMouseDown
      ) {
        const lastSelectionRange = documentStatusRef.current.lastSelectionRange

        if (lastSelectionRange) {
          handlers.handleChangeSelectLines(
            getChangeSelectLinesOptionsByRange(
              contentStatusRef.current.contentStatus.ids,
              lastSelectionRange
            ),
            {
              cursorNeedUpdate: true,
              handleFinished: () => {
                textareaRef.current?.focus()
              },
            }
          )
        }
      }

      while (handlers.commendCallbackQueue.length > 0) {
        const callback = handlers.commendCallbackQueue.shift()

        if (callback) {
          try {
            callback()
          } catch (error) {
            console.error(error)
          }
        }
      }

      while (eventsQueueRef.current.length > 0) {
        const editorManagerEvent = eventsQueueRef.current.shift()

        if (
          editorManagerEvent?.type === 'commend' &&
          editorManagerEvent.commend
        ) {
          const commend = editorManagerEvent.commend

          switch (commend) {
            case 'bold':
              handlers.handleBold()
              break
            case 'italic':
              handlers.handleItalic()
              break
            case 'strike':
              handlers.handleStrike()
              break
            case 'header':
              handlers.handleHeader()
              break
            case 'code':
              handlers.handleCode()
              break
            default:
              break
          }
        }
      }

      documentStatusRef.current.handleAnimationFrame()

      frameIdRef.current = requestAnimationFrame(update)
    }

    update()

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current)
      }
    }
  }, [handlers])

  return useMemo(() => {
    return {
      pushEvent: (event: EditorEvent) => {
        eventsQueueRef.current.push(event)
      },
    }
  }, [handlers, historyHandlers])
}

export default useEditorEventManager
