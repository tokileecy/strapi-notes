import { FnProps } from './types'
import { EditorCoreRef } from '../../useMarkdown'
import { getLineIndexById } from '../../utils'

const handleArrow = (
  editorCoreRef: EditorCoreRef,
  direction: 'UP' | 'DOWN' | 'RIGHT' | 'LEFT',
  options: FnProps
): FnProps => {
  let {
    contentLineIds,
    contentLineById,
    selectedEndLineId,
    lastSelectedLineIds,
  } = options

  contentLineById = { ...contentLineById }

  const selectedLineIndex = getLineIndexById(editorCoreRef, selectedEndLineId)
  const selectedLine = contentLineById[selectedEndLineId]

  if (selectedLineIndex !== undefined) {
    if (direction === 'DOWN') {
      let nextLineId = selectedEndLineId
      let nextLine = selectedLine

      if (selectedLineIndex < contentLineIds.length) {
        nextLine.input = false
        nextLineId = contentLineIds[selectedLineIndex + 1]
        nextLine = contentLineById[nextLineId]
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

      contentLineById[nextLineId] = nextLine
    } else if (direction === 'UP') {
      let nextLineId = selectedEndLineId
      let nextLine = selectedLine

      if (selectedLineIndex !== 0) {
        nextLine.input = false
        nextLineId = contentLineIds[selectedLineIndex - 1]
        nextLine = contentLineById[nextLineId]
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

      contentLineById[nextLineId] = nextLine
    } else if (direction === 'LEFT') {
      let nextLine = contentLineById[selectedEndLineId]
      let nextLineId = selectedEndLineId

      if (nextLine.start === 0 && selectedLineIndex !== 0) {
        nextLine.input = false
        nextLineId = contentLineIds[selectedLineIndex - 1]
        nextLine = contentLineById[nextLineId]
        nextLine.input = true

        nextLine.start = 0
        nextLine.end = 0
      } else if (nextLine.start !== 0) {
        nextLine.start--
        nextLine.end--
      }

      lastSelectedLineIds = [nextLineId]
      selectedEndLineId = nextLineId

      contentLineById[nextLineId] = nextLine
    } else if (direction === 'RIGHT') {
      let nextLine = contentLineById[selectedEndLineId]
      let nextLineId = selectedEndLineId

      if (
        nextLine.start === nextLine.text.length &&
        selectedLineIndex !== contentLineIds.length
      ) {
        nextLine.input = false
        nextLineId = contentLineIds[selectedLineIndex + 1]
        nextLine = contentLineById[nextLineId]
        nextLine.input = true

        nextLine.start = nextLine.text.length
        nextLine.end = nextLine.text.length
      } else if (nextLine.start !== nextLine.text.length) {
        nextLine.start++
        nextLine.end++
      }

      lastSelectedLineIds = [nextLineId]
      selectedEndLineId = nextLineId

      contentLineById[nextLineId] = nextLine
    }
  }

  return {
    contentLineIds,
    contentLineById,
    selectedEndLineId,
    lastSelectedLineIds,
  }
}

export default handleArrow
