import { nanoid } from 'nanoid'
import { EditorCoreRef } from '../hooks/useMarkdown'
import { ContentStatus } from '../hooks/useContentStatus'
import { getLineIndexById } from '../utils'

const code = (
  contentStatus: ContentStatus,
  editorCoreRef: EditorCoreRef
): ContentStatus => {
  let { actionHistory, selectedRange, ids, lineById } = contentStatus

  actionHistory = [...actionHistory, 'code']
  lineById = { ...lineById }

  if (selectedRange.end - selectedRange.start === 0) {
    const str = '`'
    const selectedLineId = ids[selectedRange.end]
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
    const startSelectedLineId = ids[selectedRange.start]

    const endSelectedLineId = ids[selectedRange.end]

    const startIndex = getLineIndexById(editorCoreRef, startSelectedLineId)
    const endIndex = getLineIndexById(editorCoreRef, endSelectedLineId)

    if (startIndex !== undefined && endIndex !== undefined) {
      selectedRange = { ...selectedRange }

      const topId = nanoid(6)

      const bottomId = nanoid(6)

      lineById[topId] = {
        start: 0,
        text: str,
        end: 0,
        inputText: '',
      }
      lineById[bottomId] = {
        start: 0,
        text: str,
        end: 0,
        inputText: '',
      }

      ids = [...ids]
      ids.splice(startIndex, 0, topId)
      ids.splice(endIndex + 2, 0, bottomId)
      selectedRange.end += 2
    }
  }

  return {
    actionHistory,
    ids,
    lineById,
    selectedRange,
  }
}

export default code
