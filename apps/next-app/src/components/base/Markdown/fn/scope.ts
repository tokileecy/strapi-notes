import { nanoid } from 'nanoid'
import { ContentStatus } from '../hooks/useContentStatus'
import { getLineIndexById } from './utils'

const scope = (contentStatus: ContentStatus, str: string): ContentStatus => {
  let { actionHistory, selectedRange, ids, lineById } = contentStatus

  actionHistory = [...actionHistory, 'scope']

  const startSelectedLineId = ids[selectedRange.start]
  const endSelectedLineId = ids[selectedRange.end]
  const startIndex = getLineIndexById(ids, startSelectedLineId)
  const endIndex = getLineIndexById(ids, endSelectedLineId)

  if (startIndex !== undefined && endIndex !== undefined) {
    ids = [...ids]
    lineById = { ...lineById }
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

    ids.splice(startIndex, 0, topId)
    ids.splice(endIndex + 2, 0, bottomId)
    selectedRange.end += 2
  }

  return {
    actionHistory,
    ids,
    lineById,
    selectedRange,
  }
}

export default scope
