import { useCallback, useEffect, useMemo, useRef } from 'react'
import useCoreHandlers from './useCoreHandlers'
import useHistoryHandlers from './useHistoryHandlers'
import useFrameLoop from './useFrameLoop'
import {
  getChangeSelectLinesOptionsByRange,
  getSelectionDetailByNode,
  markdownToContentStatus,
} from '../utils'
import useDocumentHandler from './useDocumentEvent'
import useContentStatus, {
  ContentStatus,
  initialContentStatus,
} from './useContentStatus'
import useTextarea from './useTextarea'
import useCommendHandler, { EditorCommendEvent } from './useCommendHandler'
import useElementCallback from './useElementCallback'

export interface MarkdownContentDetail {
  enableHtml: boolean
  text: string
}

export interface MarkdownStatus {
  markdownContentDetails: MarkdownContentDetail[]
  contentStatus: ContentStatus
  textareaRefCallback: (element: HTMLTextAreaElement) => void
  lineContainerRefCallback: (element: HTMLDivElement) => void
  reset: (value: { content?: string }) => void
  commend: (event: EditorCommendEvent) => void
}

const useMarkdown = (): MarkdownStatus => {
  const [contentStatus, setContentStatus] = useContentStatus()

  const contentStatusRef = useRef<{
    contentStatus: ContentStatus
  }>({
    contentStatus: { ...initialContentStatus },
  })

  contentStatusRef.current.contentStatus = contentStatus

  const [lineContainerRef, lineContainerRefCallback] =
    useElementCallback<HTMLDivElement>()

  const documentStatusRef = useDocumentHandler()

  const frameLoopStatusRef = useFrameLoop()

  const { handlerStatusRef, handlers } = useCoreHandlers(setContentStatus)

  const historyHandlers = useHistoryHandlers(contentStatus, setContentStatus)
  const commendHandlerRef = useCommendHandler(handlers)

  const { textareaRef, textareaRefCallback } = useTextarea(
    contentStatus,
    handlers,
    historyHandlers,
    setContentStatus
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
      const lastSelectionRange = documentStatusRef.current.lastSelectionRange

      if (lineContainerRef?.current && lastSelectionRange) {
        const endNodeDetail = getSelectionDetailByNode(
          lastSelectionRange.endContainer
        )

        if (endNodeDetail.isUnderLineContainer) {
          handlers.handleChangeSelectLines(
            getChangeSelectLinesOptionsByRange(
              contentStatusRef.current.contentStatus.ids,
              lastSelectionRange
            ),
            {
              handleFinished: () => {
                // documentStatusRef.current.lastSelectionRange = undefined
              },
            }
          )
        }
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
            handleFinished: () => {
              documentStatusRef.current.lastSelectionRange = undefined
            },
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
            handleFinished: () => {
              textareaRef.current?.focus()
            },
          }
        )
      } else {
        textareaRef.current?.focus()
      }
    }

    const handleFrame = () => {
      handlerStatusRef.current.update()
      commendHandlerRef.current.update()
      documentStatusRef.current.update()
    }

    documentStatusRef.current.on('select', handleSelect)

    documentStatusRef.current.on('clickdown', handleClickdown)

    documentStatusRef.current.on('clickup', handleClickup)

    frameLoopStatusRef.current.on('frame', handleFrame)

    return () => {
      documentStatusRef.current.off('select', handleSelect)

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
    reset,
    commend,
  }
}

export default useMarkdown
