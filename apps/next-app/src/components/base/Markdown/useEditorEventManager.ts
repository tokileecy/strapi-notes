import { MutableRefObject, useEffect, useMemo, useRef } from 'react'
import { Handlers } from './useHandlers'
import { HistoryHandlers } from './useHistoryHandlers'
import { EditorCoreRef } from './useMarkdown'

export type EditorCommend = 'bold' | 'italic' | 'strike' | 'header' | 'code'

export interface EditorKeyboardEvent {
  type: 'keyboard'
  e?: KeyboardEvent
}

export interface EditorCommendEvent {
  type: 'commend'
  commend?: EditorCommend
}

export type EditorEvent = EditorKeyboardEvent | EditorCommendEvent

const useKeydownManager = (
  textareaRef: MutableRefObject<HTMLDivElement | undefined>,
  cursorRef: MutableRefObject<HTMLDivElement | undefined>,
  editorCoreRef: EditorCoreRef,
  handlers: Handlers,
  historyHandlers: HistoryHandlers
) => {
  const eventsQueueRef = useRef<EditorEvent[]>([])
  const commendCallbackRef = useRef<() => void>()
  const frameIdRef = useRef<number>()

  useEffect(() => {
    const update = () => {
      const range = window.getSelection()?.getRangeAt(0)

      if (
        editorCoreRef.current.isSelectionEditor &&
        textareaRef?.current &&
        range
      ) {
        const cursorRange = new Range()

        cursorRange.setStart(range.endContainer, range.endOffset)

        const rect = cursorRange.getBoundingClientRect()
        const containerRect = textareaRef.current.getBoundingClientRect()

        if (rect && cursorRef.current) {
          cursorRef.current.style.left = `${
            rect.x - containerRect.x + rect.width
          }px`
          cursorRef.current.style.top = `${rect.y - containerRect.y}px`
        }
      }

      if (commendCallbackRef.current) {
        try {
          commendCallbackRef.current()
          commendCallbackRef.current = undefined
        } catch (error) {
          console.error(error)
        }
      }

      const keydownManagerEvent = eventsQueueRef.current.pop()

      eventsQueueRef.current.length = 0

      if (keydownManagerEvent?.type === 'keyboard' && keydownManagerEvent.e) {
        const e = keydownManagerEvent.e

        if (e.ctrlKey || e.metaKey) {
          if (e.key === 'z') {
            commendCallbackRef.current = historyHandlers.handleUndo?.()
          }
        } else {
          switch (e.key) {
            case 'Enter':
              historyHandlers.saveState()
              commendCallbackRef.current = handlers.handleEnter()
              break
            case 'Backspace':
              historyHandlers.saveState()
              commendCallbackRef.current = handlers.handleBackspace()
              break
            case 'Escape':
              historyHandlers.saveState()
              break
            case 'Tab':
            case 'Meta':
            case 'Alt':
            case 'Control':
            case 'Shift':
              break
            case 'ArrowUp':
              break
            case 'ArrowDown':
              break
            case 'ArrowLeft':
              break
            case 'ArrowRight':
              break
            case 'CapsLock':
              break
            case 'Space':
              break

            default: {
              historyHandlers.saveState()
              commendCallbackRef.current = handlers.handleDefault(e.key)
              break
            }
          }
        }
      } else if (
        keydownManagerEvent?.type === 'commend' &&
        keydownManagerEvent.commend
      ) {
        const commend = keydownManagerEvent.commend

        switch (commend) {
          case 'bold':
            commendCallbackRef.current = handlers.handleBold()
            break
          case 'italic':
            commendCallbackRef.current = handlers.handleItalic()
            break
          case 'strike':
            commendCallbackRef.current = handlers.handleStrike()
            break
          case 'header':
            commendCallbackRef.current = handlers.handleHeader()
            break
          case 'code':
            commendCallbackRef.current = handlers.handleCode()
            break
          default:
            break
        }
      }

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

export default useKeydownManager
