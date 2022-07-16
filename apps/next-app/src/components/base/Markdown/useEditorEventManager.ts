import { MutableRefObject, useEffect, useMemo, useRef } from 'react'
import { Handlers } from './useHandlers'
import { HistoryHandlers } from './useHistoryHandlers'
import { EditorCoreRef } from './useMarkdown'
import {
  getLineIdByElement,
  getLineIndexById,
  refreshCursorByElement,
  refreshCursorBySelection,
} from './utils'

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
  commendCallbackRef: MutableRefObject<(() => void)[]>,
  textareaRef: MutableRefObject<HTMLTextAreaElement | undefined>,
  editorDivRef: MutableRefObject<HTMLDivElement | undefined>,
  cursorRef: MutableRefObject<HTMLDivElement | undefined>,
  editorCoreRef: EditorCoreRef,
  handlers: Handlers,
  historyHandlers: HistoryHandlers
) => {
  const eventsQueueRef = useRef<EditorEvent[]>([])

  const frameIdRef = useRef<number>()

  useEffect(() => {
    const update = () => {
      if (editorCoreRef.current.isSelectionChange) {
        if (
          editorDivRef?.current &&
          cursorRef.current &&
          editorCoreRef.current.lastSelectionRange
        ) {
          const endRange = new Range()

          endRange.setStart(
            editorCoreRef.current.lastSelectionRange.endContainer,
            editorCoreRef.current.lastSelectionRange.endOffset
          )

          refreshCursorBySelection(
            editorDivRef.current,
            cursorRef.current,
            endRange
          )
        }
      }

      if (editorCoreRef.current.cursorNeedUpdate) {
        try {
          if (editorDivRef.current && cursorRef.current) {
            const contentStatus = editorCoreRef.current.contentStatus

            const selectedEndLineId =
              contentStatus.ids[contentStatus.selectedRange.end]

            const selectedEndLineElement = document.querySelector(
              `[data-id="${selectedEndLineId}"] pre`
            ) as HTMLElement

            const centerElement = selectedEndLineElement.querySelector(
              `[data-type="line-center"]`
            ) as HTMLElement

            refreshCursorByElement(
              editorDivRef.current,
              cursorRef.current,
              centerElement
            )
          }
        } catch (error) {
          console.error(error)
        }

        editorCoreRef.current.cursorNeedUpdate = false
      }

      if (
        editorCoreRef.current.isMouseDown &&
        !editorCoreRef.current.prevIsMouseDown
      ) {
        const lastSelectionRange = editorCoreRef.current.lastSelectionRange

        if (lastSelectionRange) {
          commendCallbackRef.current.push(handlers.handleClearSelectLines())
        }
      }

      if (
        !editorCoreRef.current.isMouseDown &&
        editorCoreRef.current.prevIsMouseDown
      ) {
        const lastSelectionRange = editorCoreRef.current.lastSelectionRange

        if (lastSelectionRange) {
          const start = lastSelectionRange.startOffset
          const end = lastSelectionRange.endOffset

          const startIndex = getLineIndexById(
            editorCoreRef,
            getLineIdByElement(lastSelectionRange.startContainer)
          )

          const endIndex = getLineIndexById(
            editorCoreRef,
            getLineIdByElement(lastSelectionRange.endContainer)
          )

          commendCallbackRef.current.push(
            handlers.handleChangeSelectLines(
              {
                selectedRange: {
                  start: startIndex,
                  end: endIndex,
                },
                line: { start, end },
              },
              { textureAreaFocus: true, cursorNeedUpdate: true }
            )
          )
        }
      }

      if (commendCallbackRef.current) {
        while (commendCallbackRef.current.length > 0) {
          const callback = commendCallbackRef.current.shift()

          if (callback) {
            try {
              callback()
            } catch (error) {
              console.error(error)
            }
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
              commendCallbackRef.current.push(handlers.handleBold())
              break
            case 'italic':
              commendCallbackRef.current.push(handlers.handleItalic())
              break
            case 'strike':
              commendCallbackRef.current.push(handlers.handleStrike())
              break
            case 'header':
              commendCallbackRef.current.push(handlers.handleHeader())
              break
            case 'code':
              commendCallbackRef.current.push(handlers.handleCode())
              break
            default:
              break
          }
        } else if (
          editorManagerEvent?.type === 'input' &&
          editorManagerEvent.value !== undefined
        ) {
          editorCoreRef.current?.setTexteraValue?.(editorManagerEvent.value)
          // editorCoreRef.current.cursorNeedUpdate = true
        }
      }

      editorCoreRef.current.prevIsKeyDown = editorCoreRef.current.isKeyDown
      editorCoreRef.current.prevIsMouseDown = editorCoreRef.current.isMouseDown
      editorCoreRef.current.isSelectionChange = false
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
