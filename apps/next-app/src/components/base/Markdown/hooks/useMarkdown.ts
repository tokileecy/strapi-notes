import { useCallback, useMemo, useRef } from 'react'
import useHandlers from './useHandlers'
import useHistoryHandlers from './useHistoryHandlers'
import useEditorEventManager from './useEditorEventManager'
import { markdownToContentStatus } from '../utils'
import useDodumentEvent from './useDodumentEvent'
import useContentStatus from './useContentStatus'
import useTextarea from './useTextarea'
import useCursor from './useCursor'

const useMarkdown = () => {
  const [contentStatus, setContentStatus] = useContentStatus()

  const editorDivRef = useRef<HTMLDivElement>()

  const documentStatusRef = useDodumentEvent()

  const { cursorStatusRef, cursorRef, cursorRefCallback } = useCursor()

  const historyHandlers = useHistoryHandlers(contentStatus, setContentStatus)

  const handlers = useHandlers(cursorStatusRef, contentStatus, setContentStatus)

  const { textareaRef, textareaRefCallback, handleTextareaChange } =
    useTextarea(
      contentStatus,
      handlers,
      historyHandlers,
      cursorStatusRef,
      setContentStatus
    )

  const { pushEvent } = useEditorEventManager(
    editorDivRef,
    documentStatusRef,
    cursorRef,
    textareaRef,
    cursorStatusRef,
    handlers,
    historyHandlers,
    contentStatus
  )

  const lineContainerRefCallback = useCallback((element: HTMLDivElement) => {
    if (editorDivRef.current !== element) {
      editorDivRef.current = element
    }
  }, [])

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

  const content = useMemo(() => {
    return contentStatus.ids
      .map((id) => contentStatus.lineById[id].text)
      .join('\n')
      .replace('\\*', '&ast;')
  }, [contentStatus.ids, contentStatus.lineById])

  return {
    content,
    contentStatus,
    textareaRefCallback,
    lineContainerRefCallback,
    cursorRefCallback,
    reset,
    pushEvent,
    onTextareaChange: handleTextareaChange,
  }
}

export default useMarkdown
