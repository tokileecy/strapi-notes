import { useCallback, useEffect, useRef, useState } from 'react'
import useIndexeddb from './useIndexeddb'
import useHandlers from './useHandlers'

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

  const handlers = useHandlers(textareaRef, saveState, refreshPreview)

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
    handlers,
  }
}

export default useMarkdown
