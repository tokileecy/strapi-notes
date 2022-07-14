import {
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
import useKeydownManager from './useEditorEventManager'

export interface EditorCoreRefData {
  contentLineIds: string[]
  contentLineById: Record<string, string>
  isSelectionEditor: boolean
  selectedStartLineId: string
  startOffset: number
  selectedEndLineId: string
  endOffset: number
  content?: string
  onChange?: (content: string) => void
  setContentLineIds?: Dispatch<SetStateAction<string[]>>
  setContentLineById?: Dispatch<SetStateAction<Record<string, string>>>
}

export type EditorCoreRef = MutableRefObject<EditorCoreRefData>

const useMarkdown = () => {
  const textareaRef = useRef<HTMLDivElement>()
  const cursorRef = useRef<HTMLDivElement>()

  const [contentLineIds, setContentLineIds] = useState<string[]>([])

  const [contentLineById, setContentLineById] = useState<
    Record<string, string>
  >({})

  const [content, setContent] = useState('')

  const editorCoreRef = useRef<EditorCoreRefData>({
    isSelectionEditor: false,
    startOffset: 0,
    endOffset: 0,
    selectedStartLineId: '',
    selectedEndLineId: '',
    contentLineIds: [],
    contentLineById: {},
  })

  const { dbRef } = useIndexeddb()

  const focus = useCallback(() => {
    textareaRef.current?.focus()
  }, [textareaRef])

  const historyHandlers = useHistoryHandlers(editorCoreRef)

  const reset = useCallback(
    ({ content: nextContext = '' }) => {
      setContent(nextContext)
      editorCoreRef.current.content = nextContext

      const initLines = () => {
        const nextLines = nextContext.split('\n')

        const nextIds: string[] = []
        const nextLineById: Record<string, string> = {}

        nextLines.forEach((line: string) => {
          const id = nanoid(6)

          nextIds.push(id)
          nextLineById[id] = line
        })
        setContentLineIds(nextIds)
        setContentLineById(nextLineById)
      }

      initLines()
    },
    [textareaRef, setContent]
  )

  const onChange = useCallback(
    (content: string) => {
      setContent(content)
    },
    [setContent]
  )

  const handlers = useHandlers(editorCoreRef)

  const { pushEvent } = useKeydownManager(
    textareaRef,
    cursorRef,
    editorCoreRef,
    handlers,
    historyHandlers
  )

  const textareaRefCallback = useCallback(
    (element: HTMLDivElement) => {
      if (textareaRef.current !== element) {
        textareaRef.current = element
      }
    },
    [textareaRef]
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
  }

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (editorCoreRef.current.isSelectionEditor) {
        e.preventDefault()
        pushEvent({
          type: 'keyboard',
          e,
        })
      }
    }

    const handleSelect = () => {
      const selection = window.getSelection()

      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const ancestorContainer = range.commonAncestorContainer
        let current: HTMLElement | Node = ancestorContainer

        editorCoreRef.current.isSelectionEditor = false

        for (let i = 0; i < 4; i++) {
          if (current === textareaRef.current) {
            editorCoreRef.current.isSelectionEditor = true
            break
          }

          if (current.parentElement) {
            current = current.parentElement
          } else {
            break
          }
        }

        current = range.startContainer

        for (let i = 0; i < 4; i++) {
          if (
            current instanceof HTMLElement &&
            current.dataset.type === 'wrapper'
          ) {
            editorCoreRef.current.selectedStartLineId = current.dataset.id ?? ''
            editorCoreRef.current.startOffset = range.startOffset
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
            editorCoreRef.current.endOffset = range.endOffset
            break
          }

          if (current.parentElement) {
            current = current.parentElement
          } else {
            break
          }
        }

        // if (editorCoreRef.current.isSelectionEditor && textareaRef?.current) {
        //   const rect = range.getBoundingClientRect()
        //   const containerRect = textareaRef.current.getBoundingClientRect()

        //   if (rect && cursorRef.current) {
        //     cursorRef.current.style.left = `${
        //       rect.x - containerRect.x + rect.width
        //     }px`
        //     cursorRef.current.style.top = `${rect.y - containerRect.y}px`
        //   }
        // }
      }
    }

    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('selectionchange', handleSelect)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
      document.removeEventListener('selectionchange', handleSelect)
    }
  }, [editorCoreRef, textareaRef, dbRef])

  useEffect(() => {
    setContent(
      contentLineIds
        .map((id) => contentLineById[id])
        .join('\n')
        .replace('\\*', '&ast;')
    )
  }, [contentLineIds, contentLineById])

  return {
    textareaRefCallback,
    textareaRef,
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
  }
}

export default useMarkdown
