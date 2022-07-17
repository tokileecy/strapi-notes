import {
  ChangeEventHandler,
  Dispatch,
  MutableRefObject,
  useCallback,
  useRef,
} from 'react'
import { ContentStatus, initialContentStatus } from './useContentStatus'
import { CursorStatus } from './useCursor'
import { Handlers } from './useHandlers'
import { HistoryHandlers } from './useHistoryHandlers'

const useTextarea = (
  contentStatus: ContentStatus,
  handlers: Handlers,
  historyHandlers: HistoryHandlers,
  cursorStatusRef: MutableRefObject<CursorStatus>,
  setContentStatus: Dispatch<Partial<ContentStatus>>
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
          break
        case 'Tab':
        case 'Meta':
        case 'Alt':
        case 'Control':
        case 'Shift':
          break
        case 'ArrowUp':
          handlers.handleArrow('UP')
          break
        case 'ArrowDown':
          handlers.handleArrow('DOWN')
          break
        case 'ArrowLeft':
          handlers.handleArrow('LEFT')
          break
        case 'ArrowRight':
          handlers.handleArrow('RIGHT')
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

  const handleTextareaChange: ChangeEventHandler<HTMLTextAreaElement> =
    useCallback(
      (e) => {
        const value = e.target.value

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
      },
      [handlers]
    )

  const handleCompositionstart = () => {
    textareaStatusRef.current.isCompositionstart = true
  }

  const handleCompositionupdate = () => {
    cursorStatusRef.current.cursorNeedUpdate = true
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

  const focus = useCallback(() => {
    textareaRef.current?.focus()
  }, [])

  return {
    textareaRef,
    textareaStatusRef,
    textareaRefCallback,
    handleTextareaChange,
    focus,
  }
}

export default useTextarea
