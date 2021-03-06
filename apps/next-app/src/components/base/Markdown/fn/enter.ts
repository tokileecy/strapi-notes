import { nanoid } from 'nanoid'
import { ContentStatus } from '../hooks/useContentStatus'
import handleBackspace from './backspace'
import { isSelectingWord } from './utils'

const handleEnter = (contentStatus: ContentStatus): ContentStatus => {
  let { actionHistory, ids, lineById, selectedRange } = contentStatus

  actionHistory = [...actionHistory, 'enter']
  selectedRange = { ...selectedRange }

  let startLineId = ids[selectedRange.start]

  if (isSelectingWord(contentStatus)) {
    ;({ ids, lineById, selectedRange } = handleBackspace({
      actionHistory,
      ids,
      lineById,
      selectedRange,
    }))
  }

  startLineId = ids[selectedRange.start]

  if (selectedRange.end !== -1) {
    if (lineById[startLineId].start === 0) {
      const newLineId = nanoid(6)

      ids = [...ids]
      ids.splice(selectedRange.end, 0, newLineId)

      lineById[newLineId] = {
        text: '',
        inputText: '',
        start: 0,
        end: 0,
      }
      selectedRange.start++
      selectedRange.end++
    } else {
      const newLineId = nanoid(6)

      ids = [...ids]
      lineById = { ...lineById }

      const selectedId = ids[selectedRange.end]
      const selectedLine = lineById[selectedId]

      const nextSelectedLineText = selectedLine.text.slice(
        0,
        selectedLine.start
      )

      const newLineText = selectedLine.text.slice(
        selectedLine.end,
        selectedLine.text.length
      )

      ids.splice(selectedRange.end + 1, 0, newLineId)

      lineById[newLineId] = {
        text: newLineText,
        inputText: '',
        start: 0,
        end: 0,
      }

      lineById[startLineId] = {
        text: nextSelectedLineText,
        inputText: '',
        start: 0,
        end: 0,
      }

      selectedRange.start++
      selectedRange.end++
    }
  }

  return {
    actionHistory,
    ids,
    lineById,
    selectedRange,
  }
}

export default handleEnter
