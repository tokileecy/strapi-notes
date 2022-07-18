import { useCallback, useEffect, useMemo, useRef } from 'react'
import useCoreHandlers from './useCoreHandlers'
import useHistoryHandlers from './useHistoryHandlers'
import useFrameLoop from './useFrameLoop'
import {
  getChangeSelectLinesOptionsByRange,
  markdownToContentStatus,
  refreshCursorByElement,
  refreshCursorBySelection,
} from '../utils'
import useDodumentHandler from './useDodumentEvent'
import useContentStatus, {
  ContentStatus,
  initialContentStatus,
} from './useContentStatus'
import useTextarea from './useTextarea'
import useCursor from './useCursor'
import useCommendHandler from './useCommendHandler'
import useElementCallback from './useElementCallback'

export interface MarkdownContentDetail {
  enableHtml: boolean
  text: string
}

const useMarkdown = () => {
  const [contentStatus, setContentStatus] = useContentStatus()

  const contentStatusRef = useRef<{
    contentStatus: ContentStatus
  }>({
    contentStatus: { ...initialContentStatus },
  })

  contentStatusRef.current.contentStatus = contentStatus

  const [lineContainerRef, lineContainerRefCallback] =
    useElementCallback<HTMLDivElement>()

  const documentStatusRef = useDodumentHandler()
  const { cursorRef, cursorRefCallback } = useCursor()

  const frameLoopStatusRef = useFrameLoop()

  const { handlerStatusRef, handlers } = useCoreHandlers(
    contentStatus,
    setContentStatus
  )

  const historyHandlers = useHistoryHandlers(contentStatus, setContentStatus)
  const commendHandlerRef = useCommendHandler(handlers)

  const { textareaRef, textareaRefCallback } = useTextarea(
    contentStatus,
    handlers,
    historyHandlers,
    setContentStatus,
    handlerStatusRef
  )

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

  const commend = useCallback((event) => {
    commendHandlerRef.current.commend(event)
  }, [])

  const markdownContentDetails = useMemo(() => {
    return contentStatus.ids
      .map((id) => contentStatus.lineById[id].text)

      .join('\n')
      .replace('\\*', '&ast;')
      .split('<>')
      .reduce<MarkdownContentDetail[]>((acc, section, index) => {
        if (index % 2 === 0) {
          acc.push({
            enableHtml: false,
            text: section,
          })
        } else {
          acc.push({
            enableHtml: true,
            text: section,
          })
        }

        return acc
      }, [])
  }, [contentStatus.ids, contentStatus.lineById])

  useEffect(() => {
    const handleSelect = () => {
      if (
        lineContainerRef?.current &&
        cursorRef.current &&
        documentStatusRef.current.lastSelectionRange
      ) {
        const range = new Range()

        range.setStart(
          documentStatusRef.current.lastSelectionRange.endContainer,
          documentStatusRef.current.lastSelectionRange.endOffset
        )

        refreshCursorBySelection(
          lineContainerRef.current,
          cursorRef.current,
          range
        )
      }
    }

    const handleCursorchange = () => {
      try {
        if (lineContainerRef.current && cursorRef.current) {
          const contentStatus = contentStatusRef.current.contentStatus

          if (contentStatus.selectedRange.end !== -1) {
            const selectedEndLineId =
              contentStatus.ids[contentStatus.selectedRange.end]

            const selectedEndLineElement = document.querySelector(
              `[data-id="${selectedEndLineId}"] pre`
            ) as HTMLElement

            const centerElement = selectedEndLineElement.querySelector(
              `[data-type="line-center"]`
            ) as HTMLElement

            const editorElement = document.querySelector('[data-type="editor"]')

            if (editorElement && selectedEndLineElement) {
              const scrollBottom =
                editorElement.scrollTop + editorElement.clientHeight

              const editorStyles = window.getComputedStyle(editorElement)

              const seenableBootom =
                selectedEndLineElement.offsetTop +
                selectedEndLineElement.offsetHeight +
                parseInt(editorStyles.paddingTop)

              const seenableTop =
                selectedEndLineElement.offsetTop +
                parseInt(editorStyles.paddingTop)

              const scrollTop = editorElement.scrollTop

              if (seenableBootom > scrollBottom) {
                editorElement.scrollTop += seenableBootom - scrollBottom
              }

              if (seenableTop < scrollTop) {
                editorElement.scrollTop -= scrollTop - seenableTop
              }
            }

            refreshCursorByElement(
              lineContainerRef.current,
              cursorRef.current,
              centerElement
            )
          }
        }
      } catch (error) {
        console.error(error)
      }
    }

    const handleClickdown = () => {
      const lastSelectionRange = documentStatusRef.current.lastSelectionRange

      if (lastSelectionRange) {
        handlers.handleChangeSelectLines(
          getChangeSelectLinesOptionsByRange(
            contentStatusRef.current.contentStatus.ids,
            lastSelectionRange
          ),
          {
            cursorNeedUpdate: true,
          }
        )
      }
    }

    const handleClickup = () => {
      const lastSelectionRange = documentStatusRef.current.lastSelectionRange

      if (lastSelectionRange) {
        handlers.handleChangeSelectLines(
          getChangeSelectLinesOptionsByRange(
            contentStatusRef.current.contentStatus.ids,
            lastSelectionRange
          ),
          {
            cursorNeedUpdate: true,
            handleFinished: () => {
              textareaRef.current?.focus()
            },
          }
        )
      }
    }

    const handleFrame = () => {
      handlerStatusRef.current.update()
      commendHandlerRef.current.update()
      documentStatusRef.current.update()
    }

    documentStatusRef.current.on('select', handleSelect)

    handlerStatusRef.current.on('cursorchange', handleCursorchange)

    documentStatusRef.current.on('clickdown', handleClickdown)

    documentStatusRef.current.on('clickup', handleClickup)

    frameLoopStatusRef.current.on('frame', handleFrame)

    return () => {
      documentStatusRef.current.off('select', handleSelect)

      handlerStatusRef.current.off('cursorchange', handleCursorchange)

      documentStatusRef.current.off('clickdown', handleClickdown)

      documentStatusRef.current.off('clickup', handleClickup)

      frameLoopStatusRef.current.off('frame', handleFrame)
    }
  }, [])

  return {
    markdownContentDetails,
    contentStatus,
    textareaRefCallback,
    lineContainerRefCallback,
    cursorRefCallback,
    reset,
    commend,
  }
}

export default useMarkdown
