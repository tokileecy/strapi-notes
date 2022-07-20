import Box from '@mui/material/Box'
import { MutableRefObject, useEffect, useMemo, useState } from 'react'
import { ContentStatus } from './hooks/useContentStatus'
import { getLineElementsById } from './utils'

export interface SelectAreaProps {
  contentStatus: ContentStatus
  containerRef: MutableRefObject<HTMLDivElement>
  selectAreaRefCallback?: (element: HTMLDivElement) => void
}

// TODO refactor
const SelectArea = (props: SelectAreaProps) => {
  const { contentStatus, selectAreaRefCallback, containerRef } = props
  // TODO selected range need wating for DOM update, find other solution
  const [nextFrameUpdate, setNextFrameUpdate] = useState(0)

  useEffect(() => {
    requestAnimationFrame(() => {
      setNextFrameUpdate((prev) => prev + 1)
    })
  }, [contentStatus])

  const { start, center, end } = useMemo(() => {
    interface SelectLineStatus {
      x: number
      y: number
      width: number
      height: number
    }

    let start: SelectLineStatus = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }

    let center: SelectLineStatus = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }

    let end: SelectLineStatus = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }

    const containerRect = containerRef.current.getBoundingClientRect()

    try {
      if (
        contentStatus.selectedRange.start === contentStatus.selectedRange.end
      ) {
        const endLineId = contentStatus.ids[contentStatus.selectedRange.end]
        const endLine = contentStatus.lineById[endLineId]
        const endLineElements = getLineElementsById(endLineId)

        if (endLineElements.lineElement) {
          const textNode = endLineElements.lineElement.childNodes[0]
          const range = new Range()

          range.setStart(textNode, endLine.start)
          range.setEnd(textNode, endLine.end)

          const endRect = range.getBoundingClientRect()

          const firstLineRange = new Range()

          firstLineRange.setStart(textNode, endLine.start)
          firstLineRange.setEnd(textNode, endLine.start)

          const firstLineRect = firstLineRange.getBoundingClientRect()

          let hasMultiSubLine = false
          let multiSubLineStart = 0
          let multiSubLineEnd = 0

          for (let i = endLine.start; i < endLine.end; i++) {
            const currentCharRange = new Range()

            currentCharRange.setStart(textNode, i)
            currentCharRange.setEnd(textNode, i + 1)

            const currentCharRect = currentCharRange.getBoundingClientRect()

            if (currentCharRect.y !== firstLineRect.y) {
              hasMultiSubLine = true
              multiSubLineStart = i
              break
            }
          }

          if (hasMultiSubLine) {
            if (multiSubLineStart !== endLine.end) {
              const lastLineRange = new Range()

              lastLineRange.setStart(textNode, endLine.end)
              lastLineRange.setEnd(textNode, endLine.end)

              const lastLineRect = lastLineRange.getBoundingClientRect()

              for (let i = endLine.end; i > endLine.start; i--) {
                const currentCharRange = new Range()

                currentCharRange.setStart(textNode, i - 1)
                currentCharRange.setEnd(textNode, i)

                const currentCharRect = currentCharRange.getBoundingClientRect()

                if (currentCharRect.y !== lastLineRect.y) {
                  hasMultiSubLine = true
                  multiSubLineEnd = i
                  break
                }
              }

              const startSubLineRange = new Range()
              const endSubLineRange = new Range()

              startSubLineRange.setStart(textNode, endLine.start)
              startSubLineRange.setEnd(textNode, multiSubLineStart)

              const startSubLineRect = startSubLineRange.getBoundingClientRect()

              const centerSubLineRange = new Range()

              centerSubLineRange.setStart(textNode, multiSubLineStart)
              centerSubLineRange.setEnd(textNode, multiSubLineEnd)

              const centerSubLineRect =
                centerSubLineRange.getBoundingClientRect()

              endSubLineRange.setStart(textNode, multiSubLineEnd)
              endSubLineRange.setEnd(textNode, endLine.end)

              const endSubLineRect = endSubLineRange.getBoundingClientRect()

              start = {
                x: startSubLineRect.x - containerRect.x,
                y: startSubLineRect.y - containerRect.y,
                width: startSubLineRect.width,
                height: startSubLineRect.height,
              }

              center = {
                x: centerSubLineRect.x - containerRect.x,
                y: centerSubLineRect.y - containerRect.y,
                width: centerSubLineRect.width,
                height: centerSubLineRect.height,
              }

              end = {
                x: endSubLineRect.x - containerRect.x,
                y: endSubLineRect.y - containerRect.y,
                width: endSubLineRect.width,
                height: endSubLineRect.height,
              }
            } else {
              const startSubLineRange = new Range()
              const endSubLineRange = new Range()

              startSubLineRange.setStart(textNode, endLine.start)
              startSubLineRange.setEnd(textNode, multiSubLineStart)

              const startSubLineRect = startSubLineRange.getBoundingClientRect()

              endSubLineRange.setStart(textNode, multiSubLineStart)
              endSubLineRange.setEnd(textNode, endLine.end)

              const endSubLineRect = endSubLineRange.getBoundingClientRect()

              start = {
                x: startSubLineRect.x - containerRect.x,
                y: startSubLineRect.y - containerRect.y,
                width: startSubLineRect.width,
                height: startSubLineRect.height,
              }
              end = {
                x: endSubLineRect.x - containerRect.x,
                y: endSubLineRect.y - containerRect.y,
                width: endSubLineRect.width,
                height: endSubLineRect.height,
              }
            }
          } else {
            center = {
              x: endRect.x - containerRect.x,
              y: endRect.y - containerRect.y,
              width: endRect.width,
              height: endRect.height,
            }
          }
        }
      } else {
        const startLineId = contentStatus.ids[contentStatus.selectedRange.start]
        const startLine = contentStatus.lineById[startLineId]
        const startLineElements = getLineElementsById(startLineId)

        const endLineId = contentStatus.ids[contentStatus.selectedRange.end]
        const endLine = contentStatus.lineById[endLineId]
        const endLineElements = getLineElementsById(endLineId)
        let startHasMultiSubLine = false
        let multiSubLineStart = 0
        let endhasMultiSubLine = false
        let multiSubLineEnd = 0

        if (startLineElements.lineElement) {
          const textNode = startLineElements.lineElement.childNodes[0]
          const range = new Range()

          range.setStart(textNode, startLine.start)
          range.setEnd(textNode, startLine.text.length)

          const startRect = range.getBoundingClientRect()

          const firstLineRange = new Range()

          firstLineRange.setStart(textNode, startLine.start)
          firstLineRange.setEnd(textNode, startLine.start)

          const firstLineRect = firstLineRange.getBoundingClientRect()

          for (let i = startLine.start; i < startLine.end; i++) {
            const currentCharRange = new Range()

            currentCharRange.setStart(textNode, i)
            currentCharRange.setEnd(textNode, i + 1)

            const currentCharRect = currentCharRange.getBoundingClientRect()

            if (currentCharRect.y !== firstLineRect.y) {
              startHasMultiSubLine = true
              multiSubLineStart = i
              break
            }
          }

          const startSubLineRange = new Range()

          startSubLineRange.setStart(textNode, startLine.start)
          startSubLineRange.setEnd(textNode, multiSubLineStart)

          const startSubLineRect = startSubLineRange.getBoundingClientRect()

          if (startHasMultiSubLine) {
            start = {
              x: startSubLineRect.x - containerRect.x,
              y: startSubLineRect.y - containerRect.y,
              width: startSubLineRect.width,
              height: startSubLineRect.height,
            }
          } else {
            start = {
              x: startRect.x - containerRect.x,
              y: startRect.y - containerRect.y,
              width: startRect.width,
              height: startRect.height,
            }
          }
        }

        if (endLineElements.lineElement) {
          const textNode = endLineElements.lineElement.childNodes[0]
          const range = new Range()

          range.setStart(textNode, 0)
          range.setEnd(textNode, endLine.end)

          const endRect = range.getBoundingClientRect()

          const lastLineRange = new Range()

          lastLineRange.setStart(textNode, endLine.end)
          lastLineRange.setEnd(textNode, endLine.end)

          const lastLineRect = lastLineRange.getBoundingClientRect()

          for (let i = endLine.end; i > endLine.start; i--) {
            const currentCharRange = new Range()

            currentCharRange.setStart(textNode, i - 1)
            currentCharRange.setEnd(textNode, i)

            const currentCharRect = currentCharRange.getBoundingClientRect()

            if (currentCharRect.y !== lastLineRect.y) {
              endhasMultiSubLine = true
              multiSubLineEnd = i
              break
            }
          }

          const endSubLineRange = new Range()

          endSubLineRange.setStart(textNode, multiSubLineEnd)
          endSubLineRange.setEnd(textNode, endLine.end)

          const endSubLineRect = endSubLineRange.getBoundingClientRect()

          if (endhasMultiSubLine) {
            end = {
              x: endSubLineRect.x - containerRect.x,
              y: endSubLineRect.y - containerRect.y,
              width: endSubLineRect.width,
              height: endSubLineRect.height,
            }
          } else {
            end = {
              x: endRect.x - containerRect.x,
              y: endRect.y - containerRect.y,
              width: endRect.width,
              height: endRect.height,
            }
          }
        }

        if (endhasMultiSubLine && startHasMultiSubLine) {
          const startLineId =
            contentStatus.ids[contentStatus.selectedRange.start]

          const endLineId = contentStatus.ids[contentStatus.selectedRange.end]

          const startLineElements = getLineElementsById(startLineId)
          const endLineElements = getLineElementsById(endLineId)

          if (startLineElements.lineElement && endLineElements.lineElement) {
            const startTextNode = startLineElements.lineElement.childNodes[0]
            const endTextNode = endLineElements.lineElement.childNodes[0]

            const range = new Range()

            range.setStart(startTextNode, multiSubLineStart)
            range.setEnd(endTextNode, multiSubLineEnd)

            const endRect = range.getBoundingClientRect()

            center = {
              x: endRect.x - containerRect.x,
              y: endRect.y - containerRect.y,
              width: endRect.width,
              height: endRect.height,
            }
          }
        } else if (endhasMultiSubLine) {
          const startLineId =
            contentStatus.ids[contentStatus.selectedRange.start + 1]

          const endLineId = contentStatus.ids[contentStatus.selectedRange.end]

          const startLineElements = getLineElementsById(startLineId)
          const endLine = contentStatus.lineById[endLineId]
          const endLineElements = getLineElementsById(endLineId)

          if (startLineElements.lineElement && endLineElements.lineElement) {
            const startTextNode = startLineElements.lineElement.childNodes[0]
            const endTextNode = endLineElements.lineElement.childNodes[0]

            const range = new Range()

            range.setStart(startTextNode, endLine.start)
            range.setEnd(endTextNode, multiSubLineEnd)

            const endRect = range.getBoundingClientRect()

            center = {
              x: endRect.x - containerRect.x,
              y: endRect.y - containerRect.y,
              width: endRect.width,
              height: endRect.height,
            }
          }
        } else if (startHasMultiSubLine) {
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

            const range = new Range()

            range.setStart(startTextNode, multiSubLineStart)
            range.setEnd(endTextNode, endLine.end)

            const endRect = range.getBoundingClientRect()

            center = {
              x: endRect.x - containerRect.x,
              y: endRect.y - containerRect.y,
              width: endRect.width,
              height: endRect.height,
            }
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

            const range = new Range()

            range.setStart(startTextNode, 0)
            range.setEnd(endTextNode, endLine.end)

            const endRect = range.getBoundingClientRect()

            center = {
              x: endRect.x - containerRect.x,
              y: endRect.y - containerRect.y,
              width: endRect.width,
              height: endRect.height,
            }
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
      ref={selectAreaRefCallback}
      sx={{
        'position': 'absolute',
        'width': '100%',
        'userSelect': 'none',
        'outline': 'none',
      }}
      data-type="select-area"
    >
      <Box
        sx={{
          'position': 'absolute',
          'backgroundColor': '#efefef',

          'p': 0,
          'm': 0,
          'width': `${start.width}px`,
          'height': `${start.height}px`,
          'transform': `translate(${start.x}px, ${start.y}px)`,
          'background': '#191919',
          'userSelect': 'none',
          'pointerEvents': 'none',
          'outline': 'none',
          'whiteSpace': 'break-spaces',
        }}
      ></Box>
      <Box
        sx={{
          'position': 'absolute',
          'backgroundColor': '#efefef',
          'p': 0,
          'm': 0,
          'width': `${center.width}px`,
          'height': `${center.height}px`,
          'transform': `translate(${center.x}px, ${center.y}px)`,
          'background': '#191919',
          'userSelect': 'none',
          'pointerEvents': 'none',
          'outline': 'none',
          'whiteSpace': 'break-spaces',
        }}
      ></Box>
      <Box
        sx={{
          'position': 'absolute',
          'backgroundColor': '#efefef',
          'p': 0,
          'm': 0,
          'width': `${end.width}px`,
          'height': `${end.height}px`,
          'transform': `translate(${end.x}px, ${end.y}px)`,
          'background': '#191919',
          'userSelect': 'none',
          'pointerEvents': 'none',
          'outline': 'none',
          'whiteSpace': 'break-spaces',
        }}
      ></Box>
    </Box>
  )
}

export default SelectArea
