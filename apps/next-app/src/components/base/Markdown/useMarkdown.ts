import {
  ChangeEventHandler,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { nanoid } from 'nanoid'
import useIndexeddb from './useIndexeddb'
import useHandlers from './useHandlers'
import useHistoryHandlers from './useHistoryHandlers'
import useEditorEventManager from './useEditorEventManager'
import { isUnderToolbar } from './utils'

export interface LineState {
  text: string
  input: boolean
  start: number
  end: number
}

export interface EditorCoreRefData {
  prevIsKeyDown: boolean
  prevIsMouseDown: boolean
  isKeyDown: boolean
  isMouseDown: boolean
  isSelectionChange: boolean
  cursorNeedUpdate: boolean
  lastSelectionRange?: Range
  lastInputLineId?: string
  contentLineIds: string[]
  contentLineById: Record<string, LineState>
  selectedStartLineId: string
  selectedEndLineId: string
  content?: string
  onChange?: (content: string) => void
  lastSelectedLineIds: string[]
  setContentLineIds?: Dispatch<SetStateAction<string[]>>
  setContentLineById?: Dispatch<SetStateAction<Record<string, LineState>>>
  textareaValue: string
  setTexteraValue?: Dispatch<SetStateAction<string>>
}

export type EditorCoreRef = MutableRefObject<EditorCoreRefData>

const useMarkdown = () => {
  const textareaRef = useRef<HTMLTextAreaElement>()
  const editorDivRef = useRef<HTMLDivElement>()
  const cursorRef = useRef<HTMLDivElement>()
  const commendCallbackRef = useRef<(() => void)[]>([])
  const [textareaValue, setTexteraValue] = useState<string>('')
  const [contentLineIds, setContentLineIds] = useState<string[]>([])

  const [contentLineById, setContentLineById] = useState<
    Record<string, LineState>
  >({})

  const [content, setContent] = useState('')

  const editorCoreRef = useRef<EditorCoreRefData>({
    prevIsKeyDown: false,
    prevIsMouseDown: false,
    isSelectionChange: false,
    cursorNeedUpdate: false,
    isKeyDown: false,
    isMouseDown: false,
    selectedStartLineId: '',
    selectedEndLineId: '',
    lastSelectedLineIds: [],
    contentLineIds: [],
    contentLineById: {},
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
        setContentLineIds(nextIds)
        setContentLineById(nextLineById)
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

  const handlers = useHandlers(editorCoreRef)

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
    // setTimeout(() => {
    //   editorCoreRef.current.setTexteraValue(value)
    //   // setTexteraValue(value)
    // }, 0)
    // pushEvent({
    //   type: 'input',
    //   value: e.target.value,
    // })
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
    editorCoreRef.current.contentLineIds = contentLineIds
    editorCoreRef.current.contentLineById = contentLineById
    editorCoreRef.current.setContentLineIds = setContentLineIds
    editorCoreRef.current.setContentLineById = setContentLineById
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
        let current: HTMLElement | Node = ancestorContainer

        editorCoreRef.current.isSelectionChange = false

        for (let i = 0; i < 5; i++) {
          if (current === cursorRef.current) {
            break
          }

          if (current === editorDivRef.current) {
            editorCoreRef.current.isSelectionChange = true
            editorCoreRef.current.lastSelectionRange = range

            break
          }

          if (current.parentElement) {
            current = current.parentElement
          } else {
            break
          }
        }

        current = range.startContainer

        for (let i = 0; i < 5; i++) {
          if (
            current instanceof HTMLElement &&
            current.dataset.type === 'wrapper'
          ) {
            editorCoreRef.current.selectedStartLineId = current.dataset.id ?? ''
            break
          }

          if (current.parentElement) {
            current = current.parentElement
          } else {
            break
          }
        }

        current = range.endContainer

        for (let i = 0; i < 4; i++) {
          if (
            current instanceof HTMLElement &&
            current.dataset.type === 'wrapper'
          ) {
            editorCoreRef.current.selectedEndLineId = current.dataset.id ?? ''
            break
          }

          if (current.parentElement) {
            current = current.parentElement
          } else {
            break
          }
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
      contentLineIds
        .map((id) => contentLineById[id].text)
        .join('\n')
        .replace('\\*', '&ast;')
    )
  }, [contentLineIds, contentLineById])

  return {
    textareaValue,
    textareaRefCallback,
    editorDivRefCallback,
    editorDivRef,
    cursorRef,
    cursorRefCallback,
    contentLineById,
    contentLineIds,
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
