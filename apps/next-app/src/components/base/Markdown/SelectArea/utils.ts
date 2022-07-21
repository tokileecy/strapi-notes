import { LineState } from '../hooks/useContentStatus'

export const getFirstLineDetail = (textNode: Node, lineStatus: LineState) => {
  let firstLineHasMultiViewLine = false
  let firstLineViewLineBreakPoint = 0

  const firstLineRange = new Range()

  firstLineRange.setStart(textNode, lineStatus.start)
  firstLineRange.setEnd(textNode, lineStatus.start)

  const firstLineRect = firstLineRange.getBoundingClientRect()

  for (let i = lineStatus.start; i < lineStatus.end; i++) {
    const currentCharRange = new Range()

    currentCharRange.setStart(textNode, i)
    currentCharRange.setEnd(textNode, i + 1)

    const currentCharRect = currentCharRange.getBoundingClientRect()

    if (currentCharRect.y !== firstLineRect.y) {
      firstLineHasMultiViewLine = true
      firstLineViewLineBreakPoint = i
      break
    }
  }

  return {
    firstLineHasMultiViewLine,
    firstLineViewLineBreakPoint,
  }
}

export const getLastLineDetail = (textNode: Node, endLine: LineState) => {
  let lastLineHasMultiViewLine = false
  let lastLineViewLineBreakPoint = 0

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
      lastLineHasMultiViewLine = true
      lastLineViewLineBreakPoint = i
      break
    }
  }

  return {
    lastLineHasMultiViewLine,
    lastLineViewLineBreakPoint,
  }
}

export const getSelectLineStatus = (
  containerRect: DOMRect,
  startTextNode: Node,
  endTextNode: Node,
  from: number,
  to: number
) => {
  const startSubLineRange = new Range()

  startSubLineRange.setStart(startTextNode, from)
  startSubLineRange.setEnd(endTextNode, to)

  const startSubLineRect = startSubLineRange.getBoundingClientRect()

  return {
    x: startSubLineRect.x - containerRect.x,
    y: startSubLineRect.y - containerRect.y,
    width: startSubLineRect.width,
    height: startSubLineRect.height,
  }
}
