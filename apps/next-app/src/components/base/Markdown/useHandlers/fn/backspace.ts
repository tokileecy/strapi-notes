import { EditorCoreRef } from '../../useMarkdown'
import { getLineIndexById } from '../../utils'
import { FnProps } from './types'

const handleBackspace = (
  editorCoreRef: EditorCoreRef,
  options: FnProps
): FnProps => {
  let {
    selectedEndLineId,
    lastSelectedLineIds,
    contentLineIds,
    contentLineById,
  } = options

  if (
    lastSelectedLineIds.length === 1 &&
    contentLineById[lastSelectedLineIds[0]].start === 0
  ) {
    const selectedLineId = lastSelectedLineIds[0]
    const selectedLine = contentLineById[selectedLineId]
    const lineIndex = getLineIndexById(editorCoreRef, selectedLineId)

    if (lineIndex !== undefined && lineIndex !== 0) {
      const prevLineId = contentLineIds[lineIndex - 1]
      const prevLine = contentLineById[prevLineId]

      lastSelectedLineIds = [...lastSelectedLineIds]
      lastSelectedLineIds[0] = prevLineId
      selectedEndLineId = prevLineId

      contentLineById = { ...contentLineById }
      contentLineById[selectedLineId] = {
        ...contentLineById[selectedLineId],
        text: '',
        start: 0,
        end: 0,
        input: false,
      }

      const nextPrevLineTextArr = Array.from(prevLine.text)

      const nextPrevLineText =
        nextPrevLineTextArr.splice(0, nextPrevLineTextArr.length).join('') +
        selectedLine.text

      contentLineById[prevLineId] = {
        ...prevLine,
        text: nextPrevLineText,
        start: prevLine.text.length,
        end: prevLine.text.length,
        input: true,
      }

      contentLineIds = [...contentLineIds]
      contentLineIds.splice(lineIndex, 1)
    }
  } else {
    contentLineById = { ...contentLineById }

    lastSelectedLineIds.forEach((selectedLineId) => {
      const selectedLine = contentLineById[selectedLineId]

      if (selectedLine.start !== selectedLine.end) {
        const nextLineTextArr = Array.from(selectedLine.text)

        nextLineTextArr.splice(
          selectedLine.start,
          selectedLine.end - selectedLine.start
        )

        contentLineById[selectedLineId] = {
          ...selectedLine,
          text: nextLineTextArr.join(''),
          end: selectedLine.start,
        }
      } else if (selectedLine.start !== 0) {
        const nextLineTextArr = Array.from(selectedLine.text)

        nextLineTextArr.splice(selectedLine.start - 1, 1)
        contentLineById[selectedLineId] = {
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
          contentLineById[startSelectedLineId].text +
          contentLineById[endSelectedLineId].text

        if (contentLineById[startSelectedLineId].text.length === 0) {
          contentLineById[startSelectedLineId].start = 0
          contentLineById[startSelectedLineId].end = 0
        }

        contentLineById[startSelectedLineId].text = nextStartLineText

        lastSelectedLineIds = [startSelectedLineId]
        selectedEndLineId = startSelectedLineId

        contentLineIds = [...contentLineIds]
        contentLineIds.splice(startIndex + 1, endIndex - startIndex)
      }
    }
  }

  return {
    contentLineIds,
    contentLineById,
    lastSelectedLineIds,
    selectedEndLineId,
  }
}

export default handleBackspace
