import { MutableRefObject, useEffect, useMemo, useRef } from 'react'
import { Handlers } from './useHandlers'
import { HistoryHandlers } from './useHistoryHandlers'
import { EditorCoreRef, LineState } from './useMarkdown'

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
  textareaRef: MutableRefObject<HTMLTextAreaElement | undefined>,
  editorDivRef: MutableRefObject<HTMLDivElement | undefined>,
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
      // const selection = window.getSelection()
      // let range: Range | null = null

      // if (selection && selection?.rangeCount > 0) {
      //   range = selection?.getRangeAt(0)
      // }

      const selectedStartLineId = editorCoreRef.current.selectedStartLineId
      const selectedEndLineId = editorCoreRef.current.selectedEndLineId
      const contentLineById = editorCoreRef.current.contentLineById
      const contentLineIds = editorCoreRef.current.contentLineIds
      const setContentLineById = editorCoreRef.current.setContentLineById

      if (editorCoreRef.current.isSelectionChange) {
        if (editorDivRef?.current && editorCoreRef.current.lastSelectionRange) {
          const lastSelectionRange = editorCoreRef.current.lastSelectionRange

          const startRange = new Range()
          const endRange = new Range()

          startRange.setStart(
            lastSelectionRange.startContainer,
            lastSelectionRange.startOffset
          )
          endRange.setStart(
            lastSelectionRange.endContainer,
            lastSelectionRange.endOffset
          )

          const startRect = startRange.getBoundingClientRect()
          const endRect = endRange.getBoundingClientRect()
          const containerRect = editorDivRef.current.getBoundingClientRect()

          if (endRect && startRect && cursorRef.current) {
            cursorRef.current.style.left = `${
              endRect.x - containerRect.x + endRect.width
            }px`
            cursorRef.current.style.top = `${endRect.y - containerRect.y}px`
          }
        }
      }

      const getLastSelection = (contentLineById: Record<string, LineState>) => {
        const target: Record<string, LineState> = {}

        editorCoreRef.current.lastSelectedLineIds.forEach((id) => {
          const contentLine = contentLineById[id]

          target[id] = {
            ...contentLine,
            isSelected: false,
            start: undefined,
            end: undefined,
          }
        })
        return target
      }

      if (
        editorCoreRef.current.isMouseDown &&
        !editorCoreRef.current.prevIsMouseDown
      ) {
        setContentLineById?.((prev) => {
          const target = getLastSelection(prev)

          editorCoreRef.current.lastSelectedLineIds.length = 0
          return {
            ...prev,
            ...target,
          }
        })
      }

      if (
        editorCoreRef.current.isMouseDown &&
        editorCoreRef.current.isSelectionChange
      ) {
        if (editorCoreRef.current.lastSelectionRange) {
          const startContainer =
            editorCoreRef.current.lastSelectionRange.startContainer

          const endContainer =
            editorCoreRef.current.lastSelectionRange.endContainer

          const start = editorCoreRef.current.lastSelectionRange.startOffset
          const end = editorCoreRef.current.lastSelectionRange.endOffset

          console.log(start, end, editorCoreRef.current.lastSelectionRange)

          if (startContainer === endContainer) {
            let startIndex = 0

            for (let i = 0; i < contentLineIds.length; i++) {
              const id = contentLineIds[i]

              if (id === selectedStartLineId) {
                startIndex = i
                break
              }
            }

            const lastContentLineId = contentLineIds[startIndex]

            setContentLineById?.((prev) => {
              const unSelectTarget = getLastSelection(prev)

              editorCoreRef.current.lastSelectedLineIds.length = 0

              editorCoreRef.current.lastSelectedLineIds.push(lastContentLineId)
              return {
                ...prev,
                ...unSelectTarget,
                [lastContentLineId]: {
                  ...prev[lastContentLineId],
                  isSelected: true,
                  start,
                  end,
                },
              }
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

              const unSelectTarget = getLastSelection(prev)

              editorCoreRef.current.lastSelectedLineIds.length = 0

              for (let i = startIndex; i <= endIndex; i++) {
                const lineId = contentLineIds[i]
                const contentLine = contentLineById[lineId]

                editorCoreRef.current.lastSelectedLineIds.push(lineId)

                if (i === startIndex) {
                  target[lineId] = {
                    ...contentLine,
                    isSelected: true,
                    start,
                    end: undefined,
                  }
                } else if (i === endIndex) {
                  target[lineId] = {
                    ...contentLine,
                    isSelected: true,
                    start: undefined,
                    end,
                  }
                } else {
                  target[lineId] = {
                    ...contentLine,
                    isSelected: true,
                    start: undefined,
                    end: undefined,
                  }
                }
              }

              return {
                ...prev,
                ...unSelectTarget,
                ...target,
              }
            })
          }
        }
      }

      if (
        !editorCoreRef.current.isMouseDown &&
        editorCoreRef.current.prevIsMouseDown
      ) {
        textareaRef.current?.focus()
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
              // commendCallbackRef.current = handlers.handleDefault(e.key)
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

export default useKeydownManager
