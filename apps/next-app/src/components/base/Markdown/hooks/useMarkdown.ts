import {
  ChangeEventHandler,
  Dispatch,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import useHandlers from './useHandlers'
import useHistoryHandlers from './useHistoryHandlers'
import useEditorEventManager from './useEditorEventManager'
import { markdownToContentStatus } from '../utils'
import useDodumentEvent from './useDodumentEvent'
import useContentStatus, {
  ContentStatus,
  initialContentStatus,
} from './useContentStatus'

export interface EditorCoreRefData {
  isCompositionstart: boolean
  cursorNeedUpdate: boolean
  content?: string
  contentStatus: ContentStatus
  setContentStatus?: Dispatch<Partial<ContentStatus>>
  focus: () => void
}

export type EditorCoreRef = MutableRefObject<EditorCoreRefData>

const useMarkdown = () => {
  const [content, setContent] = useState('')
  const [contentStatus, setContentStatus] = useContentStatus()
  const textareaRef = useRef<HTMLTextAreaElement>()
  const editorDivRef = useRef<HTMLDivElement>()
  const cursorRef = useRef<HTMLDivElement>()
  const commendCallbackRef = useRef<(() => void)[]>([])

  const documentStatusRef = useDodumentEvent()

  const editorCoreRef = useRef<EditorCoreRefData>({
    isCompositionstart: false,
    cursorNeedUpdate: false,
    contentStatus: { ...initialContentStatus },
    focus: () => {
      textareaRef.current?.focus()
    },
  })

  const historyHandlers = useHistoryHandlers(editorCoreRef)

  const reset = useCallback(({ content: nextContext = '' }) => {
    const initLines = () => {
      const { ids, lineById } = markdownToContentStatus(nextContext)

      setContentStatus({
        actionHistory: ['reset'],
        ids,
        lineById,
      })
    }

    initLines()
  }, [])

  const handlers = useHandlers(editorCoreRef)

  const { pushEvent } = useEditorEventManager(
    commendCallbackRef,
    editorDivRef,
    documentStatusRef,
    cursorRef,
    editorCoreRef,
    handlers,
    historyHandlers
  )

  const hanldeTextareaKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }

    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z') {
        commendCallbackRef.current.push(historyHandlers.handleUndo?.())
      }
    } else {
      switch (e.key) {
        case 'Enter': {
          if (editorCoreRef.current?.contentStatus.selectedRange.end === -1) {
            historyHandlers.saveState()

            commendCallbackRef.current.push(handlers.handleEnter())
            e.preventDefault()
          } else {
            const inputLineId =
              editorCoreRef.current?.contentStatus.ids[
                editorCoreRef.current?.contentStatus.selectedRange.end
              ]

            const inputText =
              editorCoreRef.current?.contentStatus.lineById[inputLineId]
                .inputText

            if (inputText.length === 0) {
              historyHandlers.saveState()
              commendCallbackRef.current.push(handlers.handleEnter())
              e.preventDefault()
            }
          }

          break
        }

        case 'Backspace': {
          if (editorCoreRef.current?.contentStatus.selectedRange.end === -1) {
            historyHandlers.saveState()
            commendCallbackRef.current.push(handlers.handleBackspace())
            e.preventDefault()
          } else {
            const inputLineId =
              editorCoreRef.current?.contentStatus.ids[
                editorCoreRef.current?.contentStatus.selectedRange.end
              ]

            const inputText =
              editorCoreRef.current?.contentStatus.lineById[inputLineId]
                .inputText

            if (inputText.length === 0) {
              historyHandlers.saveState()
              commendCallbackRef.current.push(handlers.handleBackspace())
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
          commendCallbackRef.current.push(handlers.handleArrow('UP'))
          break
        case 'ArrowDown':
          commendCallbackRef.current.push(handlers.handleArrow('DOWN'))
          break
        case 'ArrowLeft':
          commendCallbackRef.current.push(handlers.handleArrow('LEFT'))
          break
        case 'ArrowRight':
          commendCallbackRef.current.push(handlers.handleArrow('RIGHT'))
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

        const inputLineId = contentStatus.ids[contentStatus.selectedRange.end]
        const nextLineById = { ...editorCoreRef.current.contentStatus.lineById }

        nextLineById[inputLineId] = {
          ...nextLineById[inputLineId],
          inputText: value,
        }

        if (!editorCoreRef.current.isCompositionstart) {
          commendCallbackRef.current.push(
            handlers.handleAddWord(value, {
              cursorNeedUpdate: true,
              finishedComposition: true,
            })
          )
        } else {
          setContentStatus({
            actionHistory: ['input'],
            lineById: nextLineById,
          })
        }
      },
      [handlers, setContentStatus]
    )

  const handleCompositionstart = () => {
    editorCoreRef.current.isCompositionstart = true
  }

  const handleCompositionupdate = () => {
    editorCoreRef.current.cursorNeedUpdate = true
  }

  const handleCompositionend = (e: CompositionEvent) => {
    const value = e.data

    if (editorCoreRef.current.isCompositionstart) {
      commendCallbackRef.current.push(
        handlers.handleAddWord(value, {
          cursorNeedUpdate: true,
          finishedComposition: true,
        })
      )
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

  const editorDivRefCallback = useCallback((element: HTMLDivElement) => {
    if (editorDivRef.current !== element) {
      editorDivRef.current = element
    }
  }, [])

  const cursorRefCallback = useCallback((element: HTMLDivElement) => {
    if (cursorRef.current !== element) {
      cursorRef.current = element
    }
  }, [])

  if (editorCoreRef.current) {
    editorCoreRef.current.content = content
    editorCoreRef.current.contentStatus = contentStatus
    editorCoreRef.current.setContentStatus = setContentStatus
  }

  useEffect(() => {
    setContent(
      contentStatus.ids
        .map((id) => contentStatus.lineById[id].text)
        .join('\n')
        .replace('\\*', '&ast;')
    )
  }, [contentStatus.ids, contentStatus.lineById])

  return {
    textareaRefCallback,
    editorDivRefCallback,
    cursorRefCallback,
    contentStatus,
    content,
    reset,
    pushEvent,
    onTextareaChange: handleTextareaChange,
  }
}

export default useMarkdown
