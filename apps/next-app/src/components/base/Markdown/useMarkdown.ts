import {
  ChangeEventHandler,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
import { nanoid } from 'nanoid'
import useIndexeddb from './useIndexeddb'
import useHandlers from './useHandlers'
import useHistoryHandlers from './useHistoryHandlers'
import useEditorEventManager from './useEditorEventManager'
import { isUnderEditor, isUnderToolbar } from './utils'

export interface LineState {
  text: string
  input: boolean
  start: number
  end: number
}

export interface ContentStatus {
  actionHistory: string[]
  ids: string[]
  lineById: Record<string, LineState>
  selectedRange: {
    start: number
    end: number
  }
}

export interface EditorCoreRefData {
  prevIsKeyDown: boolean
  prevIsMouseDown: boolean
  isKeyDown: boolean
  isMouseDown: boolean
  isSelectionChange: boolean
  cursorNeedUpdate: boolean
  lastSelectionRange?: Range
  content?: string
  onChange?: (content: string) => void
  textareaValue: string
  setTexteraValue?: Dispatch<SetStateAction<string>>
  contentStatus: ContentStatus
  setContentStatus?: Dispatch<Partial<ContentStatus>>
}

export type EditorCoreRef = MutableRefObject<EditorCoreRefData>

export const initialContentStatus: ContentStatus = {
  actionHistory: [],
  ids: [],
  lineById: {},
  selectedRange: {
    start: -1,
    end: -1,
  },
}

const useMarkdown = () => {
  const textareaRef = useRef<HTMLTextAreaElement>()
  const editorDivRef = useRef<HTMLDivElement>()
  const cursorRef = useRef<HTMLDivElement>()
  const commendCallbackRef = useRef<(() => void)[]>([])
  const [textareaValue, setTexteraValue] = useState<string>('')

  const [contentStatus, setContentStatus] = useReducer(
    (prev: ContentStatus, next: Partial<ContentStatus>) => {
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('contentStatus updeate:', next.actionHistory, next)
      // }

      return {
        ...prev,
        ...next,
        actionHistory: [] as string[],
      }
    },
    {
      ...initialContentStatus,
    }
  )

  const [content, setContent] = useState('')

  const editorCoreRef = useRef<EditorCoreRefData>({
    prevIsKeyDown: false,
    prevIsMouseDown: false,
    isSelectionChange: false,
    cursorNeedUpdate: false,
    isKeyDown: false,
    isMouseDown: false,
    contentStatus: { ...initialContentStatus },
    textareaValue: '',
  })

  const { dbRef } = useIndexeddb()

  const focus = useCallback(() => {
    editorDivRef.current?.focus()
  }, [editorDivRef])

  const historyHandlers = useHistoryHandlers(editorCoreRef)

  const reset = useCallback(
    ({ content: nextContext = '' }) => {
      setContent(nextContext)
      editorCoreRef.current.content = nextContext

      const initLines = () => {
        const nextLines = nextContext.split('\n')

        const nextIds: string[] = []
        const nextLineById: Record<string, LineState> = {}

        nextLines.forEach((line: string) => {
          const id = nanoid(6)

          nextIds.push(id)
          nextLineById[id] = {
            text: line,
            input: false,
            start: 0,
            end: 0,
          }
        })
        setContentStatus({
          actionHistory: ['reset'],
          ids: nextIds,
          lineById: nextLineById,
        })
      }

      initLines()
    },
    [editorDivRef, setContent]
  )

  const onChange = useCallback(
    (content: string) => {
      setContent(content)
    },
    [setContent]
  )

  const handlers = useHandlers(editorCoreRef, textareaRef)

  const { pushEvent } = useEditorEventManager(
    commendCallbackRef,
    textareaRef,
    editorDivRef,
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

  const handleTextareaChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const value = e.target.value

    setTexteraValue(value)
  }

  const textareaRefCallback = useCallback(
    (element: HTMLTextAreaElement) => {
      if (textareaRef.current !== element) {
        textareaRef.current?.removeEventListener(
          'keydown',
          hanldeTextareaKeydown
        )
        textareaRef.current = element
        textareaRef.current?.addEventListener('keydown', hanldeTextareaKeydown)
      }
    },
    [textareaRef]
  )

  const editorDivRefCallback = useCallback(
    (element: HTMLDivElement) => {
      if (editorDivRef.current !== element) {
        editorDivRef.current = element
      }
    },
    [editorDivRef]
  )

  const cursorRefCallback = useCallback(
    (element: HTMLDivElement) => {
      if (cursorRef.current !== element) {
        cursorRef.current = element
      }
    },
    [cursorRef]
  )

  if (editorCoreRef.current) {
    editorCoreRef.current.onChange = onChange
    editorCoreRef.current.content = content
    editorCoreRef.current.contentStatus = contentStatus
    editorCoreRef.current.setContentStatus = setContentStatus
    editorCoreRef.current.textareaValue = textareaValue
    editorCoreRef.current.setTexteraValue = setTexteraValue
  }

  useEffect(() => {
    const handleKeydown = () => {
      editorCoreRef.current.isKeyDown = true
    }

    const handleMouseup = () => {
      editorCoreRef.current.isMouseDown = false
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (e.target) {
        if (!isUnderToolbar(e.target as Element)) {
          editorCoreRef.current.isMouseDown = true
        }
      }
    }

    const handleKeyup = () => {
      editorCoreRef.current.isKeyDown = false
    }

    const handleSelect = () => {
      const selection = window.getSelection()

      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const ancestorContainer = range.commonAncestorContainer

        editorCoreRef.current.isSelectionChange = false

        if (isUnderEditor(ancestorContainer)) {
          editorCoreRef.current.isSelectionChange = true
          editorCoreRef.current.lastSelectionRange = range
        }
      }
    }

    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('keyup', handleKeyup)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseup)
    document.addEventListener('selectionchange', handleSelect)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
      document.removeEventListener('keyup', handleKeyup)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseup)
      document.removeEventListener('selectionchange', handleSelect)
    }
  }, [editorCoreRef, editorDivRef, dbRef])

  useEffect(() => {
    setContent(
      contentStatus.ids
        .map((id) => contentStatus.lineById[id].text)
        .join('\n')
        .replace('\\*', '&ast;')
    )
  }, [contentStatus.ids, contentStatus.lineById])

  return {
    textareaValue,
    textareaRefCallback,
    editorDivRefCallback,
    editorDivRef,
    cursorRef,
    cursorRefCallback,
    contentStatus,
    content,
    setContent,
    reset,
    onChange,
    focus,
    pushEvent,
    onTextareaChange: handleTextareaChange,
  }
}

export default useMarkdown
