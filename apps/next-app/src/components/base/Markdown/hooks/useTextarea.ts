import {
  Dispatch,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import { ContentStatus, initialContentStatus } from './useContentStatus'
import { Handlers, HandlerStatus } from './useCoreHandlers'
import { HistoryHandlers } from './useHistoryHandlers'

const useTextarea = (
  contentStatus: ContentStatus,
  handlers: Handlers,
  historyHandlers: HistoryHandlers,
  setContentStatus: Dispatch<Partial<ContentStatus>>,
  handlerStatusRef: MutableRefObject<HandlerStatus>
) => {
  const textareaStatusRef = useRef<{ isCompositionstart: boolean }>({
    isCompositionstart: false,
  })

  const textareaRef = useRef<HTMLTextAreaElement>()

  const contentStatusRef = useRef<{
    contentStatus: ContentStatus
  }>({
    contentStatus: { ...initialContentStatus },
  })

  if (contentStatusRef.current) {
    contentStatusRef.current.contentStatus = contentStatus
  }

  const hanldeTextareaKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }

    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z') {
        historyHandlers.handleUndo()
      }
    } else {
      switch (e.key) {
        case 'Enter': {
          if (contentStatusRef.current.contentStatus.selectedRange.end === -1) {
            historyHandlers.saveState()

            handlers.handleEnter()
            e.preventDefault()
          } else {
            const inputLineId =
              contentStatusRef.current.contentStatus.ids[
                contentStatusRef.current.contentStatus.selectedRange.end
              ]

            const inputText =
              contentStatusRef.current.contentStatus.lineById[inputLineId]
                .inputText

            if (inputText.length === 0) {
              historyHandlers.saveState()
              handlers.handleEnter()
              e.preventDefault()
            }
          }

          break
        }

        case 'Backspace': {
          if (contentStatusRef.current.contentStatus.selectedRange.end === -1) {
            historyHandlers.saveState()
            handlers.handleBackspace()
            e.preventDefault()
          } else {
            const inputLineId =
              contentStatusRef.current.contentStatus.ids[
                contentStatusRef.current.contentStatus.selectedRange.end
              ]

            const inputText =
              contentStatusRef.current.contentStatus.lineById[inputLineId]
                .inputText

            if (inputText.length === 0) {
              historyHandlers.saveState()
              handlers.handleBackspace()
              e.preventDefault()
            }
          }

          break
        }

        case 'Escape':
          historyHandlers.saveState()

          if (!textareaStatusRef.current.isCompositionstart) {
            handlers.handleAddWord(textareaRef.current?.value ?? '', {
              cursorNeedUpdate: true,
              handleFinished: () => {
                textareaRef.current?.focus()
                textareaStatusRef.current.isCompositionstart = false
              },
            })
          }

          break
        case 'Tab':
        case 'Meta':
        case 'Alt':
        case 'Control':
        case 'Shift':
          break
        case 'ArrowUp':
          console.log('?', textareaStatusRef.current.isCompositionstart)

          if (!textareaStatusRef.current.isCompositionstart) {
            handlers.handleArrow('UP')
          }

          break
        case 'ArrowDown':
          if (!textareaStatusRef.current.isCompositionstart) {
            handlers.handleArrow('DOWN')
          }

          break
        case 'ArrowLeft':
          if (!textareaStatusRef.current.isCompositionstart) {
            handlers.handleArrow('LEFT')
          }

          break
        case 'ArrowRight':
          if (!textareaStatusRef.current.isCompositionstart) {
            handlers.handleArrow('RIGHT')
          }

          break
        case 'CapsLock':
          break
        case 'Space':
          break

        default: {
          break
        }
      }
    }
  }

  const handleTextareaChange = (e: Event) => {
    const element = e.target as HTMLTextAreaElement
    const value = element.value

    const contentStatus = contentStatusRef.current.contentStatus
    const inputLineId = contentStatus.ids[contentStatus.selectedRange.end]

    const nextLineById = {
      ...contentStatus.lineById,
    }

    nextLineById[inputLineId] = {
      ...nextLineById[inputLineId],
      inputText: value,
    }

    if (!textareaStatusRef.current.isCompositionstart) {
      handlers.handleAddWord(value, {
        cursorNeedUpdate: true,
        handleFinished: () => {
          textareaRef.current?.focus()
          textareaStatusRef.current.isCompositionstart = false
        },
      })
    } else {
      setContentStatus({
        actionHistory: ['input'],
        lineById: nextLineById,
      })
    }
  }

  const handleCompositionstart = () => {
    textareaStatusRef.current.isCompositionstart = true
  }

  const handleCompositionupdate = () => {
    handlerStatusRef.current.noticeCursorNeedUpdate()
  }

  const handleCompositionend = (e: CompositionEvent) => {
    const value = e.data

    if (textareaStatusRef.current.isCompositionstart) {
      handlers.handleAddWord(value, {
        cursorNeedUpdate: true,
        handleFinished: () => {
          textareaRef.current?.focus()
          textareaStatusRef.current.isCompositionstart = false
        },
      })
    }
  }

  const textareaRefCallback = useCallback((element: HTMLTextAreaElement) => {
    if (textareaRef.current !== element) {
      textareaRef.current?.removeEventListener('input', handleTextareaChange)
      textareaRef.current?.removeEventListener('keydown', hanldeTextareaKeydown)
      textareaRef.current?.removeEventListener(
        'compositionstart',
        handleCompositionstart
      )

      textareaRef.current?.removeEventListener(
        'compositionupdate',
        handleCompositionupdate
      )
      textareaRef.current?.removeEventListener(
        'compositionend',
        handleCompositionend
      )
      textareaRef.current = element
      textareaRef.current?.addEventListener('input', handleTextareaChange)
      textareaRef.current?.addEventListener(
        'compositionstart',
        handleCompositionstart
      )
      textareaRef.current?.addEventListener(
        'compositionupdate',
        handleCompositionupdate
      )
      textareaRef.current?.addEventListener(
        'compositionend',
        handleCompositionend
      )
      textareaRef.current?.addEventListener('keydown', hanldeTextareaKeydown)
    }
  }, [])

  useEffect(() => {
    if (textareaRef.current) {
      let inputText = ''

      if (contentStatus.selectedRange.end !== -1) {
        const lineById = contentStatus.lineById
        const lineId = contentStatus.ids[contentStatus.selectedRange.end]

        inputText = lineById[lineId].inputText
      }

      textareaRef.current.value = inputText
    }
  }, [contentStatus])

  const focus = useCallback(() => {
    textareaRef.current?.focus()
  }, [])

  return {
    textareaRef,
    textareaStatusRef,
    textareaRefCallback,
    focus,
  }
}

export default useTextarea
