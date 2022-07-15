import { nanoid } from 'nanoid'
import { ContentStatus, EditorCoreRef } from '../../useMarkdown'
import { getLineIndexById } from '../../utils'

const code = (
  contentStatus: ContentStatus,
  editorCoreRef: EditorCoreRef
): ContentStatus => {
  let { selectedEndLineId, lastSelectedLineIds, ids, lineById } = contentStatus

  lineById = { ...lineById }

  if (contentStatus.lastSelectedLineIds.length === 1) {
    const str = '`'
    const selectedLineId = contentStatus.lastSelectedLineIds[0]
    const selectedLine = lineById[selectedLineId]

    const nextTextArr = Array.from(lineById[selectedLineId].text)

    nextTextArr.splice(selectedLine.start, 0, str)
    nextTextArr.splice(selectedLine.end + 1, 0, str)

    const nextText = nextTextArr.join('')

    lineById[selectedLineId] = { ...lineById[selectedLineId] }
    lineById[selectedLineId].text = nextText
    lineById[selectedLineId].start += str.length
    lineById[selectedLineId].end += str.length
  } else {
    const str = '```'
    const startSelectedLineId = contentStatus.lastSelectedLineIds[0]

    const endSelectedLineId =
      contentStatus.lastSelectedLineIds[
        contentStatus.lastSelectedLineIds.length - 1
      ]

    const startIndex = getLineIndexById(editorCoreRef, startSelectedLineId)
    const endIndex = getLineIndexById(editorCoreRef, endSelectedLineId)

    if (startIndex !== undefined && endIndex !== undefined) {
      const topId = nanoid(6)

      const bottomId = nanoid(6)

      lineById[topId] = {
        start: 0,
        text: str,
        end: 0,
        input: false,
      }
      lineById[bottomId] = {
        start: 0,
        text: str,
        end: 0,
        input: false,
      }

      ids = [...ids]
      ids.splice(startIndex, 0, topId)
      ids.splice(endIndex + 2, 0, bottomId)
    }
  }

  return {
    ids,
    lineById,
    lastSelectedLineIds,
    selectedEndLineId,
  }
}

export default code
