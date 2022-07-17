import { EditorCoreRef } from '../hooks/useMarkdown'
import { ContentStatus } from '../hooks/useContentStatus'
import { getLineIndexById, getSelectedIdsByIndexRange } from '../utils'

const handleBackspace = (
  contentStatus: ContentStatus,
  editorCoreRef: EditorCoreRef
): ContentStatus => {
  let { actionHistory, selectedRange, ids, lineById } = contentStatus

  actionHistory = [...actionHistory, 'backspace']
  selectedRange = { ...selectedRange }

  const lastSelectedLineIds = getSelectedIdsByIndexRange(ids, selectedRange)

  if (
    selectedRange.end - selectedRange.start === 0 &&
    lineById[lastSelectedLineIds[0]].start === 0
  ) {
    const selectedLineId = lastSelectedLineIds[0]
    const selectedLine = lineById[selectedLineId]

    if (selectedRange.end !== undefined && selectedRange.end !== 0) {
      const preLineIndex = selectedRange.end - 1
      const prevLineId = ids[preLineIndex]
      const prevLine = lineById[prevLineId]

      lineById = { ...lineById }
      lineById[selectedLineId] = {
        ...lineById[selectedLineId],
        text: '',
        start: 0,
        end: 0,
      }

      const nextPrevLineTextArr = Array.from(prevLine.text)

      const nextPrevLineText =
        nextPrevLineTextArr.splice(0, nextPrevLineTextArr.length).join('') +
        selectedLine.text

      lineById[prevLineId] = {
        ...prevLine,
        text: nextPrevLineText,
        start: prevLine.text.length,
        end: prevLine.text.length,
      }

      ids = [...ids]
      ids.splice(selectedRange.end, 1)

      selectedRange.end = preLineIndex
      selectedRange.start = preLineIndex
    }
  } else {
    lineById = { ...lineById }

    lastSelectedLineIds.forEach((selectedLineId) => {
      const selectedLine = lineById[selectedLineId]

      if (selectedLine.start !== selectedLine.end) {
        const nextLineTextArr = Array.from(selectedLine.text)

        nextLineTextArr.splice(
          selectedLine.start,
          selectedLine.end - selectedLine.start
        )

        lineById[selectedLineId] = {
          ...selectedLine,
          text: nextLineTextArr.join(''),
          end: selectedLine.start,
        }
      } else if (selectedLine.start !== 0) {
        const nextLineTextArr = Array.from(selectedLine.text)

        nextLineTextArr.splice(selectedLine.start - 1, 1)
        lineById[selectedLineId] = {
          ...selectedLine,
          text: nextLineTextArr.join(''),
          start: selectedLine.start - 1,
          end: selectedLine.start - 1,
        }
      }
    })

    if (lastSelectedLineIds.length > 1) {
      const startSelectedLineId = lastSelectedLineIds[0]

      const endSelectedLineId =
        lastSelectedLineIds[lastSelectedLineIds.length - 1]

      const startIndex = getLineIndexById(editorCoreRef, startSelectedLineId)

      const endIndex = getLineIndexById(editorCoreRef, endSelectedLineId)

      if (startIndex && endIndex) {
        const nextStartLineText =
          lineById[startSelectedLineId].text + lineById[endSelectedLineId].text

        if (lineById[startSelectedLineId].text.length === 0) {
          lineById[startSelectedLineId].start = 0
          lineById[startSelectedLineId].end = 0
        }

        lineById[startSelectedLineId].text = nextStartLineText

        selectedRange.end = selectedRange.start

        ids = [...ids]
        ids.splice(startIndex + 1, endIndex - startIndex)
      }
    }
  }

  return {
    actionHistory,
    ids,
    lineById,
    selectedRange,
  }
}

export default handleBackspace
