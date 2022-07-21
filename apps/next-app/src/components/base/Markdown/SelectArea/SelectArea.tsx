import Box from '@mui/material/Box'
import { MutableRefObject, useEffect, useMemo, useState } from 'react'
import { ContentStatus } from '../hooks/useContentStatus'
import { getLineElementsById } from '../utils'
import SelectLine, { SelectLineProps } from './SelectLine'
import {
  getFirstLineDetail,
  getLastLineDetail,
  getSelectLineStatus,
} from './utils'

export interface SelectAreaProps {
  contentStatus: ContentStatus
  containerRef: MutableRefObject<HTMLDivElement>
}

// TODO refactor
const SelectArea = (props: SelectAreaProps) => {
  const { contentStatus, containerRef } = props
  // TODO selected range need wating for DOM update, find other solution
  const [nextFrameUpdate, setNextFrameUpdate] = useState(0)

  useEffect(() => {
    requestAnimationFrame(() => {
      setNextFrameUpdate((prev) => prev + 1)
    })
  }, [contentStatus])

  const { start, center, end } = useMemo(() => {
    let start: SelectLineProps = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }

    let center: SelectLineProps = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }

    let end: SelectLineProps = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }

    const containerRect = containerRef.current.getBoundingClientRect()

    const isSelectingMultiLines =
      contentStatus.selectedRange.start !== contentStatus.selectedRange.end

    try {
      if (!isSelectingMultiLines) {
        const endLineId = contentStatus.ids[contentStatus.selectedRange.end]
        const endLine = contentStatus.lineById[endLineId]
        const endLineElements = getLineElementsById(endLineId)

        if (endLineElements.lineElement) {
          const endTextNode = endLineElements.lineElement.childNodes[0]

          const { firstLineHasMultiViewLine, firstLineViewLineBreakPoint } =
            getFirstLineDetail(endTextNode, endLine)

          if (firstLineHasMultiViewLine) {
            if (firstLineViewLineBreakPoint !== endLine.end) {
              const { lastLineViewLineBreakPoint } = getLastLineDetail(
                endTextNode,
                endLine
              )

              start = getSelectLineStatus(
                containerRect,
                endTextNode,
                endTextNode,
                endLine.start,
                firstLineViewLineBreakPoint
              )

              center = getSelectLineStatus(
                containerRect,
                endTextNode,
                endTextNode,
                firstLineViewLineBreakPoint,
                lastLineViewLineBreakPoint
              )

              end = getSelectLineStatus(
                containerRect,
                endTextNode,
                endTextNode,
                lastLineViewLineBreakPoint,
                endLine.end
              )
            } else {
              start = getSelectLineStatus(
                containerRect,
                endTextNode,
                endTextNode,
                endLine.start,
                firstLineViewLineBreakPoint
              )

              end = getSelectLineStatus(
                containerRect,
                endTextNode,
                endTextNode,
                firstLineViewLineBreakPoint,
                endLine.end
              )
            }
          } else {
            center = getSelectLineStatus(
              containerRect,
              endTextNode,
              endTextNode,
              endLine.start,
              endLine.end
            )
          }
        }
      } else {
        const startLineId = contentStatus.ids[contentStatus.selectedRange.start]
        const startLine = contentStatus.lineById[startLineId]
        const startLineElements = getLineElementsById(startLineId)

        const endLineId = contentStatus.ids[contentStatus.selectedRange.end]
        const endLine = contentStatus.lineById[endLineId]
        const endLineElements = getLineElementsById(endLineId)

        let firstLineHasMultiViewLine = false
        let firstLineViewLineBreakPoint = 0
        let lastLineHasMultiViewLine = false
        let lastLineViewLineBreakPoint = 0

        if (startLineElements.lineElement) {
          const textNode = startLineElements.lineElement.childNodes[0]
          const range = new Range()

          range.setStart(textNode, startLine.start)
          range.setEnd(textNode, startLine.text.length)
          ;({ firstLineHasMultiViewLine, firstLineViewLineBreakPoint } =
            getFirstLineDetail(textNode, startLine))

          if (firstLineHasMultiViewLine) {
            start = getSelectLineStatus(
              containerRect,
              textNode,
              textNode,
              startLine.start,
              firstLineViewLineBreakPoint
            )
          } else {
            start = getSelectLineStatus(
              containerRect,
              textNode,
              textNode,
              startLine.start,
              startLine.text.length
            )
          }
        }

        if (endLineElements.lineElement) {
          const textNode = endLineElements.lineElement.childNodes[0]

          ;({ lastLineHasMultiViewLine, lastLineViewLineBreakPoint } =
            getLastLineDetail(textNode, endLine))

          if (lastLineHasMultiViewLine) {
            end = getSelectLineStatus(
              containerRect,
              textNode,
              textNode,
              lastLineViewLineBreakPoint,
              endLine.end
            )
          } else {
            end = getSelectLineStatus(
              containerRect,
              textNode,
              textNode,
              0,
              endLine.end
            )
          }
        }

        if (lastLineHasMultiViewLine && firstLineHasMultiViewLine) {
          const startLineId =
            contentStatus.ids[contentStatus.selectedRange.start]

          const endLineId = contentStatus.ids[contentStatus.selectedRange.end]

          const startLineElements = getLineElementsById(startLineId)
          const endLineElements = getLineElementsById(endLineId)

          if (startLineElements.lineElement && endLineElements.lineElement) {
            const startTextNode = startLineElements.lineElement.childNodes[0]
            const endTextNode = endLineElements.lineElement.childNodes[0]

            center = getSelectLineStatus(
              containerRect,
              startTextNode,
              endTextNode,
              firstLineViewLineBreakPoint,
              lastLineViewLineBreakPoint
            )
          }
        } else if (lastLineHasMultiViewLine) {
          const startLineId =
            contentStatus.ids[contentStatus.selectedRange.start + 1]

          const endLineId = contentStatus.ids[contentStatus.selectedRange.end]

          const startLineElements = getLineElementsById(startLineId)
          const endLine = contentStatus.lineById[endLineId]
          const endLineElements = getLineElementsById(endLineId)

          if (startLineElements.lineElement && endLineElements.lineElement) {
            const startTextNode = startLineElements.lineElement.childNodes[0]
            const endTextNode = endLineElements.lineElement.childNodes[0]

            center = getSelectLineStatus(
              containerRect,
              startTextNode,
              endTextNode,
              endLine.start,
              lastLineViewLineBreakPoint
            )
          }
        } else if (firstLineHasMultiViewLine) {
          const startLineId =
            contentStatus.ids[contentStatus.selectedRange.start]

          const endLineId =
            contentStatus.ids[contentStatus.selectedRange.end - 1]

          const startLineElements = getLineElementsById(startLineId)
          const endLine = contentStatus.lineById[endLineId]
          const endLineElements = getLineElementsById(endLineId)

          if (startLineElements.lineElement && endLineElements.lineElement) {
            const startTextNode = startLineElements.lineElement.childNodes[0]
            const endTextNode = endLineElements.lineElement.childNodes[0]

            center = getSelectLineStatus(
              containerRect,
              startTextNode,
              endTextNode,
              firstLineViewLineBreakPoint,
              endLine.end
            )
          }
        } else {
          const startLineId =
            contentStatus.ids[contentStatus.selectedRange.start + 1]

          const endLineId =
            contentStatus.ids[contentStatus.selectedRange.end - 1]

          const startLineElements = getLineElementsById(startLineId)
          const endLine = contentStatus.lineById[endLineId]
          const endLineElements = getLineElementsById(endLineId)

          if (startLineElements.lineElement && endLineElements.lineElement) {
            const startTextNode = startLineElements.lineElement.childNodes[0]
            const endTextNode = endLineElements.lineElement.childNodes[0]

            center = getSelectLineStatus(
              containerRect,
              startTextNode,
              endTextNode,
              0,
              endLine.end
            )
          }
        }
      }
    } catch (error) {
      console.error(error)
    }

    return { start, center, end }
  }, [nextFrameUpdate])

  return (
    <Box
      sx={{
        'position': 'absolute',
        'width': '100%',
        'userSelect': 'none',
        'outline': 'none',
      }}
      data-type="select-area"
    >
      <SelectLine {...start} />
      <SelectLine {...center} />
      <SelectLine {...end} />
    </Box>
  )
}

export default SelectArea
