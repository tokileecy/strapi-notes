import { useCallback, useEffect, useRef, useState } from 'react'
import useIndexeddb from './useIndexeddb'

const maxCacheCount = 50

const useMarkdown = () => {
  const textDivRef = useRef<HTMLDivElement>()
  const [content, setContent] = useState('')

  const previousRevisionRef = useRef<string[]>([])

  const callbackRef = useRef<{
    content?: string
    onChange?: (content: string) => void
  }>({})

  const { dbRef } = useIndexeddb()

  const focus = useCallback(() => {
    textDivRef.current?.focus()
  }, [textDivRef])

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

    const selection = window.getSelection()

    if (selection) {
      selection.empty()
    }

    if (previousRevision.length > 0) {
      const prevContext = previousRevision.pop()

      if (prevContext) {
        if (textDivRef.current) {
          textDivRef.current.innerText = prevContext
        }

        callbackRef.current?.onChange?.(prevContext)
        return prevContext
      }
    }

    return null
  }, [])

  const reset = useCallback(
    ({ id, content: nextContext = '' }) => {
      if (textDivRef?.current) {
        setContent(nextContext)
        textDivRef.current.innerText = nextContext
        callbackRef.current.content = nextContext
      }
    },
    [textDivRef, setContent]
  )

  const onChange = useCallback(
    (content: string) => {
      setContent(content)
    },
    [setContent]
  )

  const refreshPreview = useCallback(() => {
    setContent(textDivRef.current?.innerText ?? '')
  }, [setContent])

  const handleBold = useCallback(() => {
    saveState?.()

    const selection = window.getSelection()

    console.log(selection)

    if (selection?.rangeCount) {
      const range = selection?.getRangeAt(0)

      const endNode = range.endContainer
      const startNode = range.startContainer
      const prevEndOffset = range.endOffset
      const prevStartOffset = range.startOffset

      console.log('>>>', range, endNode, startNode)

      if (endNode.textContent) {
        const endBeforeStr = endNode.textContent.slice(0, prevEndOffset)

        const endAfterStr = endNode.textContent.slice(
          prevEndOffset,
          endNode.textContent?.length
        )

        endNode.textContent = `${endBeforeStr}**${endAfterStr}`
      }

      if (startNode.textContent) {
        const startBeforeStr = startNode.textContent.slice(0, prevStartOffset)

        const startAfterStr = startNode.textContent.slice(
          prevStartOffset,
          startNode.textContent?.length
        )

        startNode.textContent = `${startBeforeStr}**${startAfterStr}`
      }

      console.log(
        '!',
        range,
        startNode,
        endNode,
        prevStartOffset,
        prevEndOffset
      )

      // if (startNode === endNode) {
      //   range.setStart(range.startContainer, prevStartOffset)
      //   range.setEnd(range.endContainer, prevEndOffset + 4)
      // } else {
      //   range.setStart(range.startContainer, prevStartOffset)
      //   range.setEnd(range.endContainer, prevEndOffset + 2)
      // }

      textDivRef.current?.focus()
    }

    refreshPreview?.()
  }, [refreshPreview])

  const divRefCallback = useCallback(
    (element: HTMLDivElement) => {
      const handleInput = (e: Event) => {
        const div = e.target as HTMLDivElement

        callbackRef.current.onChange?.(div.innerText)
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
        textDivRef &&
        textDivRef.current &&
        element &&
        textDivRef.current !== element
      ) {
        textDivRef.current.removeEventListener('input', handleInput)
        textDivRef.current.removeEventListener('keydown', handleKeydown)
        textDivRef.current = element
        textDivRef.current.innerText = callbackRef.current.content ?? ''
        textDivRef.current.addEventListener('input', handleInput)
        textDivRef.current.addEventListener('keydown', handleKeydown)
      }

      if (textDivRef && !textDivRef.current && element) {
        textDivRef.current = element
        textDivRef.current.innerText = callbackRef.current.content ?? ''
        textDivRef?.current.addEventListener('input', handleInput)
        textDivRef?.current.addEventListener('keydown', handleKeydown)
      }
    },
    [callbackRef, textDivRef, dbRef]
  )

  if (callbackRef.current) {
    callbackRef.current.onChange = onChange
    callbackRef.current.content = content
  }

  useEffect(() => {
    if (textDivRef?.current) {
      textDivRef.current.innerText = callbackRef.current.content ?? ''
    }
  }, [textDivRef])

  useEffect(() => {
    setContent(content?.replace('\\*', '&ast;') ?? '')
  }, [])

  return {
    divRefCallback,
    textDivRef,
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
