import { MutableRefObject, useEffect, useMemo, useRef } from 'react'
import { Handlers } from './useHandlers'
import { HistoryHandlers } from './useHistoryHandlers'
import { EditorCoreRef, LineState } from './useMarkdown'
import { refreshCursorByElement, refreshCursorBySelection } from './utils'

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
      const contentStatus = editorCoreRef.current.contentStatus
      const setContentStatus = editorCoreRef.current.setContentStatus

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
              `[data-id="${contentStatus.selectedEndLineId}"] pre`
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
          console.log(contentStatus.selectedEndLineId)
          // console.error(error)
        }

        editorCoreRef.current.cursorNeedUpdate = false
      }

      const getLastSelection = (contentLineById: Record<string, LineState>) => {
        const target: Record<string, LineState> = {}

        contentStatus.lastSelectedLineIds.forEach((id) => {
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
        const target = getLastSelection(contentStatus.lineById)

        editorCoreRef.current.contentStatus.lastSelectedLineIds.length = 0
        setContentStatus?.({
          lineById: { ...contentStatus.lineById, ...target },
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

            for (let i = 0; i < contentStatus.ids.length; i++) {
              const id = contentStatus.ids[i]

              if (id === editorCoreRef.current.selectedStartLineId) {
                startIndex = i
                break
              }
            }

            const lastContentLineId = contentStatus.ids[startIndex]

            let nextLineById = { ...contentStatus.lineById }

            if (editorCoreRef.current.lastInputLineId !== undefined) {
              const lastInputLineId = editorCoreRef.current.lastInputLineId

              const lastLine = nextLineById[lastInputLineId]

              nextLineById[lastInputLineId] = { ...lastLine, input: false }
            }

            editorCoreRef.current.lastInputLineId =
              contentStatus.selectedEndLineId

            let nextLine = nextLineById[contentStatus.selectedEndLineId]

            nextLineById[contentStatus.selectedEndLineId] = {
              ...nextLine,
              input: true,
            }

            const unSelectTarget = getLastSelection(nextLineById)

            nextLineById = { ...nextLineById, ...unSelectTarget }

            const nextLastSelectedLineIds = [lastContentLineId]

            if (editorCoreRef.current.lastInputLineId !== undefined) {
              const lastInputLineId = editorCoreRef.current.lastInputLineId

              const lastLine = nextLineById[lastInputLineId]

              nextLineById[lastInputLineId] = { ...lastLine, input: false }
            }

            editorCoreRef.current.lastInputLineId =
              contentStatus.selectedEndLineId

            nextLine = nextLineById[contentStatus.selectedEndLineId]

            nextLineById[contentStatus.selectedEndLineId] = {
              ...nextLine,
              input: true,
            }

            nextLineById[lastContentLineId].start = start
            nextLineById[lastContentLineId].end = end

            setContentStatus?.({
              lineById: nextLineById,
              lastSelectedLineIds: nextLastSelectedLineIds,
            })
          } else if (
            editorCoreRef.current.selectedStartLineId !== '' &&
            contentStatus.selectedEndLineId !== ''
          ) {
            let startIndex = 0
            let endIndex = 0

            for (let i = 0; i < contentStatus.ids.length; i++) {
              const id = contentStatus.ids[i]

              if (id === editorCoreRef.current.selectedStartLineId) {
                startIndex = i
              }

              if (id === contentStatus.selectedEndLineId) {
                endIndex = i
              }
            }

            const unSelectTarget = getLastSelection(contentStatus.lineById)

            const nextLineById = {
              ...contentStatus.lineById,
              ...unSelectTarget,
            }

            if (editorCoreRef.current.lastInputLineId !== undefined) {
              const lastInputLineId = editorCoreRef.current.lastInputLineId

              const lastLine = nextLineById[lastInputLineId]

              nextLineById[lastInputLineId] = { ...lastLine, input: false }
            }

            editorCoreRef.current.lastInputLineId =
              contentStatus.selectedEndLineId

            const nextLine = nextLineById[contentStatus.selectedEndLineId]

            nextLineById[contentStatus.selectedEndLineId] = {
              ...nextLine,
              input: true,
            }

            contentStatus.lastSelectedLineIds.length = 0

            for (let i = startIndex; i <= endIndex; i++) {
              const lineId = contentStatus.ids[i]
              const contentLine = nextLineById[lineId]

              contentStatus.lastSelectedLineIds.push(lineId)

              if (i === startIndex) {
                nextLineById[lineId] = {
                  ...contentLine,
                  start,
                  end: contentLine.text.length,
                }
              } else if (i === endIndex) {
                nextLineById[lineId] = {
                  ...contentLine,
                  start: 0,
                  end,
                }
              } else {
                nextLineById[lineId] = {
                  ...contentLine,
                  start: 0,
                  end: contentLine.text.length,
                }
              }
            }

            setContentStatus?.({
              lineById: nextLineById,
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
