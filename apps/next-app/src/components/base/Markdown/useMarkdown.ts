import { useCallback, useEffect, useRef, useState } from 'react'
import useIndexeddb from './useIndexeddb'

const maxCacheCount = 50

const useMarkdown = () => {
  const textareaRef = useRef<HTMLTextAreaElement>()
  const [content, setContent] = useState('')

  const previousRevisionRef = useRef<string[]>([])

  const callbackRef = useRef<{
    content?: string
    onChange?: (content: string) => void
  }>({})

  const { dbRef } = useIndexeddb()

  const focus = useCallback(() => {
    textareaRef.current?.focus()
  }, [textareaRef])

  const saveState = useCallback(() => {
    if (callbackRef?.current?.content) {
      if (previousRevisionRef.current.length > maxCacheCount) {
        previousRevisionRef.current.shift()
      }

      previousRevisionRef.current.push(callbackRef?.current?.content)
    }
  }, [previousRevisionRef, callbackRef])

  const undoEdit = useCallback(() => {
    const previousRevision = previousRevisionRef.current

    if (previousRevision.length > 0) {
      const prevContext = previousRevision.pop()

      if (prevContext) {
        if (textareaRef.current) {
          textareaRef.current.value = prevContext
        }

        callbackRef.current?.onChange?.(prevContext)
        return prevContext
      }
    }

    return null
  }, [])

  const reset = useCallback(
    ({ content: nextContext = '' }) => {
      if (textareaRef?.current) {
        setContent(nextContext)
        textareaRef.current.value = nextContext
        callbackRef.current.content = nextContext
      }
    },
    [textareaRef, setContent]
  )

  const onChange = useCallback(
    (content: string) => {
      setContent(content)
    },
    [setContent]
  )

  const refreshPreview = useCallback(() => {
    setContent(textareaRef.current?.value ?? '')
  }, [setContent])

  const handleBold = useCallback(() => {
    saveState?.()

    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd

      const startStr = textareaRef.current.value.slice(0, start)
      const centerSTr = textareaRef.current.value.slice(start, end)

      const endSTr = textareaRef.current.value.slice(
        end,
        textareaRef.current.value.length
      )

      const nextStr = `${startStr}**${centerSTr}**${endSTr}`

      textareaRef.current.value = nextStr
      textareaRef.current.selectionStart = start
      textareaRef.current.selectionEnd = end + 4
      textareaRef.current?.focus()
    }

    refreshPreview?.()
  }, [refreshPreview])

  const textareaRefCallback = useCallback(
    (element: HTMLTextAreaElement) => {
      const handleInput = (e: Event) => {
        const textarea = e.target as HTMLTextAreaElement

        callbackRef.current.onChange?.(textarea.value)
      }

      const handleKeydown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
          e.preventDefault()

          undoEdit?.()
        } else {
          switch (e.key) {
            case 'Enter':
            case 'Backspace':
            case 'Escape':
              saveState()
              break
            default:
              break
          }
        }
      }

      if (
        textareaRef &&
        textareaRef.current &&
        element &&
        textareaRef.current !== element
      ) {
        textareaRef.current.removeEventListener('input', handleInput)
        textareaRef.current.removeEventListener('keydown', handleKeydown)
        textareaRef.current = element
        textareaRef.current.value = callbackRef.current.content ?? ''
        textareaRef.current.addEventListener('input', handleInput)
        textareaRef.current.addEventListener('keydown', handleKeydown)
      }

      if (textareaRef && !textareaRef.current && element) {
        textareaRef.current = element
        textareaRef.current.value = callbackRef.current.content ?? ''
        textareaRef?.current.addEventListener('input', handleInput)
        textareaRef?.current.addEventListener('keydown', handleKeydown)
      }
    },
    [callbackRef, textareaRef, dbRef]
  )

  if (callbackRef.current) {
    callbackRef.current.onChange = onChange
    callbackRef.current.content = content
  }

  useEffect(() => {
    if (textareaRef?.current) {
      textareaRef.current.value = callbackRef.current.content ?? ''
    }
  }, [textareaRef])

  useEffect(() => {
    setContent(content?.replace('\\*', '&ast;') ?? '')
  }, [])

  return {
    textareaRefCallback,
    textareaRef,
    content,
    setContent,
    reset,
    refreshPreview,
    onChange,
    saveState,
    undoEdit,
    focus,
    handlers: {
      handleBold,
    },
  }
}

export default useMarkdown
