import { ContentStatus, EditorCoreRef } from '../../useMarkdown'
import { getLineIndexById } from '../../utils'

const handleArrow = (
  contentStatus: ContentStatus,
  editorCoreRef: EditorCoreRef,
  direction: 'UP' | 'DOWN' | 'RIGHT' | 'LEFT'
): ContentStatus => {
  let { ids, lineById, selectedEndLineId, lastSelectedLineIds } = contentStatus

  lineById = { ...lineById }

  const selectedLineIndex = getLineIndexById(editorCoreRef, selectedEndLineId)
  const selectedLine = lineById[selectedEndLineId]

  if (selectedLineIndex !== undefined) {
    if (direction === 'DOWN') {
      let nextLineId = selectedEndLineId
      let nextLine = selectedLine

      if (selectedLineIndex < ids.length) {
        nextLine.input = false
        nextLineId = ids[selectedLineIndex + 1]
        nextLine = lineById[nextLineId]
        nextLine.input = true
        lastSelectedLineIds = [nextLineId]
        selectedEndLineId = nextLineId

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
        nextLineId = ids[selectedLineIndex - 1]
        nextLine = lineById[nextLineId]
        nextLine.input = true
        lastSelectedLineIds = [nextLineId]
        selectedEndLineId = nextLineId

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
      let nextLine = lineById[selectedEndLineId]
      let nextLineId = selectedEndLineId

      if (nextLine.start === 0 && selectedLineIndex !== 0) {
        nextLine.input = false
        nextLineId = ids[selectedLineIndex - 1]
        nextLine = lineById[nextLineId]
        nextLine.input = true

        nextLine.start = 0
        nextLine.end = 0
      } else if (nextLine.start !== 0) {
        nextLine.start--
        nextLine.end--
      }

      lastSelectedLineIds = [nextLineId]
      selectedEndLineId = nextLineId

      lineById[nextLineId] = nextLine
    } else if (direction === 'RIGHT') {
      let nextLine = lineById[selectedEndLineId]
      let nextLineId = selectedEndLineId

      if (
        nextLine.start === nextLine.text.length &&
        selectedLineIndex !== ids.length
      ) {
        nextLine.input = false
        nextLineId = ids[selectedLineIndex + 1]
        nextLine = lineById[nextLineId]
        nextLine.input = true

        nextLine.start = nextLine.text.length
        nextLine.end = nextLine.text.length
      } else if (nextLine.start !== nextLine.text.length) {
        nextLine.start++
        nextLine.end++
      }

      lastSelectedLineIds = [nextLineId]
      selectedEndLineId = nextLineId

      lineById[nextLineId] = nextLine
    }
  }

  return {
    ids,
    lineById,
    selectedEndLineId,
    lastSelectedLineIds,
  }
}

export default handleArrow
