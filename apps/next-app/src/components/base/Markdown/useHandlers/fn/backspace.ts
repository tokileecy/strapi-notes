import { ContentStatus, EditorCoreRef } from '../../useMarkdown'
import { getLineIndexById } from '../../utils'

const handleBackspace = (
  contentStatus: ContentStatus,
  editorCoreRef: EditorCoreRef
): ContentStatus => {
  let { selectedEndLineId, lastSelectedLineIds, ids, lineById } = contentStatus

  if (
    lastSelectedLineIds.length === 1 &&
    lineById[lastSelectedLineIds[0]].start === 0
  ) {
    const selectedLineId = lastSelectedLineIds[0]
    const selectedLine = lineById[selectedLineId]
    const lineIndex = getLineIndexById(editorCoreRef, selectedLineId)

    if (lineIndex !== undefined && lineIndex !== 0) {
      const prevLineId = ids[lineIndex - 1]
      const prevLine = lineById[prevLineId]

      lastSelectedLineIds = [...lastSelectedLineIds]
      lastSelectedLineIds[0] = prevLineId
      selectedEndLineId = prevLineId

      lineById = { ...lineById }
      lineById[selectedLineId] = {
        ...lineById[selectedLineId],
        text: '',
        start: 0,
        end: 0,
        input: false,
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
        input: true,
      }

      ids = [...ids]
      ids.splice(lineIndex, 1)
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

        lastSelectedLineIds = [startSelectedLineId]
        selectedEndLineId = startSelectedLineId

        ids = [...ids]
        ids.splice(startIndex + 1, endIndex - startIndex)
      }
    }
  }

  return {
    ids,
    lineById,
    lastSelectedLineIds,
    selectedEndLineId,
  }
}

export default handleBackspace
