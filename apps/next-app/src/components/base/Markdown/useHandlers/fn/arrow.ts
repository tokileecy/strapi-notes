import { ContentStatus, EditorCoreRef } from '../../useMarkdown'

export type ArrowDirection = 'UP' | 'DOWN' | 'RIGHT' | 'LEFT'

const handleArrow = (
  contentStatus: ContentStatus,
  editorCoreRef: EditorCoreRef,
  direction: ArrowDirection
): ContentStatus => {
  let { actionHistory, ids, lineById, selectedRange } = contentStatus

  actionHistory = [...actionHistory, 'arrow']
  lineById = { ...lineById }
  selectedRange = { ...selectedRange }

  const selectedLineIndex = selectedRange.end
  const selectedEndLineId = ids[selectedRange.end]
  const selectedLine = lineById[selectedEndLineId]

  if (selectedLineIndex !== undefined) {
    if (direction === 'DOWN') {
      let nextLineId = selectedEndLineId
      let nextLine = selectedLine

      if (selectedLineIndex < ids.length) {
        nextLine.input = false

        const nextLineIndex = selectedLineIndex + 1

        nextLineId = ids[nextLineIndex]
        nextLine = lineById[nextLineId]
        nextLine.input = true
        selectedRange.start = nextLineIndex
        selectedRange.end = nextLineIndex

        if (selectedLine.end < nextLine.text.length) {
          nextLine.start = selectedLine.end
          nextLine.end = selectedLine.end
        } else {
          nextLine.start = nextLine.text.length
          nextLine.end = nextLine.text.length
        }
      } else {
        nextLine.start = nextLine.text.length
        nextLine.end = nextLine.text.length
      }

      lineById[nextLineId] = nextLine
    } else if (direction === 'UP') {
      let nextLineId = selectedEndLineId
      let nextLine = selectedLine

      if (selectedLineIndex !== 0) {
        nextLine.input = false

        const nextLineIndex = selectedLineIndex - 1

        nextLineId = ids[nextLineIndex]
        nextLine = lineById[nextLineId]
        nextLine.input = true

        selectedRange.start = nextLineIndex
        selectedRange.end = nextLineIndex

        if (selectedLine.end < nextLine.text.length) {
          nextLine.start = selectedLine.end
          nextLine.end = selectedLine.end
        } else {
          nextLine.start = nextLine.text.length
          nextLine.end = nextLine.text.length
        }
      } else {
        nextLine.start = 0
        nextLine.end = 0
      }

      lineById[nextLineId] = nextLine
    } else if (direction === 'LEFT') {
      let nextLine = { ...lineById[selectedEndLineId] }
      let nextLineId = selectedEndLineId
      let nextLineIndex = selectedLineIndex

      if (nextLine.start === 0 && selectedLineIndex !== 0) {
        nextLine.input = false
        nextLineIndex = selectedLineIndex - 1
        nextLineId = ids[nextLineIndex]
        nextLine = lineById[nextLineId]
        nextLine.input = true

        nextLine.start = 0
        nextLine.end = 0
      } else if (nextLine.start !== 0) {
        nextLine.start--
        nextLine.end--
      }

      selectedRange.start = nextLineIndex
      selectedRange.end = nextLineIndex

      lineById[nextLineId] = nextLine
    } else if (direction === 'RIGHT') {
      let nextLine = { ...lineById[selectedEndLineId] }
      let nextLineId = selectedEndLineId
      let nextLineIndex = selectedLineIndex

      if (
        nextLine.start === nextLine.text.length &&
        selectedLineIndex !== ids.length
      ) {
        nextLine.input = false
        nextLineIndex = selectedLineIndex + 1
        nextLineId = ids[nextLineIndex]
        nextLine = lineById[nextLineId]
        nextLine.input = true

        nextLine.start = nextLine.text.length
        nextLine.end = nextLine.text.length
      } else if (nextLine.start !== nextLine.text.length) {
        nextLine.start++
        nextLine.end++
      }

      selectedRange.start = nextLineIndex
      selectedRange.end = nextLineIndex

      lineById[nextLineId] = nextLine
    }
  }

  return {
    actionHistory,
    ids,
    lineById,
    selectedRange,
  }
}

export default handleArrow
