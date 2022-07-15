import { MutableRefObject, useEffect, useMemo, useRef } from 'react'
import { Handlers } from './useHandlers'
import { HistoryHandlers } from './useHistoryHandlers'
import { EditorCoreRef, LineState } from './useMarkdown'
import { refreshCursorByElement, refreshCursorBySelection } from './utils'

export type EditorCommend = 'bold' | 'italic' | 'strike' | 'header' | 'code'

export interface EditorKeyboardEvent {
  type: 'keyboard'
  e?: KeyboardEvent
}

export interface EditorCommendEvent {
  type: 'commend'
  commend?: EditorCommend
}
export interface InputCommendEvent {
  type: 'input'
  value?: string
}

export type EditorEvent =
  | EditorKeyboardEvent
  | EditorCommendEvent
  | InputCommendEvent

const useKeydownManager = (
  textareaRef: MutableRefObject<HTMLTextAreaElement | undefined>,
  editorDivRef: MutableRefObject<HTMLDivElement | undefined>,
  cursorRef: MutableRefObject<HTMLDivElement | undefined>,
  editorCoreRef: EditorCoreRef,
  handlers: Handlers,
  historyHandlers: HistoryHandlers
) => {
  const eventsQueueRef = useRef<EditorEvent[]>([])
  const commendCallbackRef = useRef<(() => void)[]>([])
  const frameIdRef = useRef<number>()

  useEffect(() => {
    const update = () => {
      const selectedStartLineId = editorCoreRef.current.selectedStartLineId
      const selectedEndLineId = editorCoreRef.current.selectedEndLineId
      const contentLineIds = editorCoreRef.current.contentLineIds
      const setContentLineById = editorCoreRef.current.setContentLineById

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
            const selectedEndLineElement = document.querySelector(
              `[data-id="${editorCoreRef.current.selectedEndLineId}"] pre`
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

      const getLastSelection = (contentLineById: Record<string, LineState>) => {
        const target: Record<string, LineState> = {}

        editorCoreRef.current.lastSelectedLineIds.forEach((id) => {
          const contentLine = contentLineById[id]

          target[id] = {
            ...contentLine,
            start: 0,
            end: 0,
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
        !editorCoreRef.current.isMouseDown &&
        editorCoreRef.current.prevIsMouseDown
      ) {
        if (editorCoreRef.current.lastSelectionRange) {
          const startContainer =
            editorCoreRef.current.lastSelectionRange.startContainer

          const endContainer =
            editorCoreRef.current.lastSelectionRange.endContainer

          const start = editorCoreRef.current.lastSelectionRange.startOffset
          const end = editorCoreRef.current.lastSelectionRange.endOffset

          let startLine
          let endLine

          let current = startContainer

          for (let i = 0; i < 5; i++) {
            if (
              current instanceof HTMLElement &&
              current.dataset.type === 'line'
            ) {
              startLine = current
              break
            }

            if (current.parentElement) {
              current = current.parentElement
            } else {
              break
            }
          }

          current = endContainer

          for (let i = 0; i < 4; i++) {
            if (
              current instanceof HTMLElement &&
              current.dataset.type === 'line'
            ) {
              endLine = current
              break
            }

            if (current.parentElement) {
              current = current.parentElement
            } else {
              break
            }
          }

          if (startLine === endLine) {
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
              const next = { ...prev }

              if (editorCoreRef.current.lastInputLineId !== undefined) {
                const lastInputLineId = editorCoreRef.current.lastInputLineId

                const lastLine = prev[lastInputLineId]

                next[lastInputLineId] = { ...lastLine, input: false }
              }

              editorCoreRef.current.lastInputLineId = selectedEndLineId

              const nextLine = prev[selectedEndLineId]

              next[selectedEndLineId] = { ...nextLine, input: true }

              return next
            })

            setContentLineById?.((prev) => {
              const unSelectTarget = getLastSelection(prev)

              const next = { ...prev, ...unSelectTarget }

              editorCoreRef.current.lastSelectedLineIds.length = 0

              editorCoreRef.current.lastSelectedLineIds.push(lastContentLineId)

              if (editorCoreRef.current.lastInputLineId !== undefined) {
                const lastInputLineId = editorCoreRef.current.lastInputLineId

                const lastLine = prev[lastInputLineId]

                next[lastInputLineId] = { ...lastLine, input: false }
              }

              editorCoreRef.current.lastInputLineId = selectedEndLineId

              const nextLine = prev[selectedEndLineId]

              next[selectedEndLineId] = { ...nextLine, input: true }

              return {
                ...next,
                [lastContentLineId]: {
                  ...next[lastContentLineId],
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
              const next = { ...prev, ...unSelectTarget }

              if (editorCoreRef.current.lastInputLineId !== undefined) {
                const lastInputLineId = editorCoreRef.current.lastInputLineId

                const lastLine = prev[lastInputLineId]

                next[lastInputLineId] = { ...lastLine, input: false }
              }

              editorCoreRef.current.lastInputLineId = selectedEndLineId

              const nextLine = prev[selectedEndLineId]

              next[selectedEndLineId] = { ...nextLine, input: true }

              editorCoreRef.current.lastSelectedLineIds.length = 0

              for (let i = startIndex; i <= endIndex; i++) {
                const lineId = contentLineIds[i]
                const contentLine = next[lineId]

                editorCoreRef.current.lastSelectedLineIds.push(lineId)

                if (i === startIndex) {
                  target[lineId] = {
                    ...contentLine,
                    start,
                    end: contentLine.text.length,
                  }
                } else if (i === endIndex) {
                  target[lineId] = {
                    ...contentLine,
                    start: 0,
                    end,
                  }
                } else {
                  target[lineId] = {
                    ...contentLine,
                    start: 0,
                    end: contentLine.text.length,
                  }
                }
              }

              return {
                ...next,
                ...target,
              }
            })
          }
        }

        textareaRef.current?.focus()
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
        const keydownManagerEvent = eventsQueueRef.current.shift()

        if (keydownManagerEvent?.type === 'keyboard' && keydownManagerEvent.e) {
          const e = keydownManagerEvent.e

          if (e.ctrlKey || e.metaKey) {
            if (e.key === 'z') {
              commendCallbackRef.current.push(historyHandlers.handleUndo?.())
            }
          } else {
            switch (e.key) {
              case 'Enter':
                if (editorCoreRef.current?.textareaValue.length === 0) {
                  historyHandlers.saveState()

                  commendCallbackRef.current.push(handlers.handleEnter())
                  e.preventDefault()
                }

                break
              case 'Backspace':
                if (editorCoreRef.current?.textareaValue.length === 0) {
                  historyHandlers.saveState()
                  commendCallbackRef.current.push(handlers.handleBackspace())
                }

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
                // historyHandlers.saveState()
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
          keydownManagerEvent?.type === 'input' &&
          keydownManagerEvent.value !== undefined
        ) {
          editorCoreRef.current?.setTexteraValue?.(keydownManagerEvent.value)
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

export default useKeydownManager
