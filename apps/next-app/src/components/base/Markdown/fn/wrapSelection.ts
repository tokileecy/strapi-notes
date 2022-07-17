import { ContentStatus } from '../hooks/useContentStatus'

const wrapSelection = (
  contentStatus: ContentStatus,
  str: string
): ContentStatus => {
  let { actionHistory, selectedRange, ids, lineById } = contentStatus

  actionHistory = [...actionHistory, 'wrap-selection']
  lineById = { ...lineById }

  if (selectedRange.end - selectedRange.start === 0) {
    const selectedLineId = ids[selectedRange.end]
    const selectedLine = lineById[selectedLineId]

    const nextTextArr = Array.from(lineById[selectedLineId].text)

    nextTextArr.splice(selectedLine.start, 0, str)
    nextTextArr.splice(selectedLine.end + 1, 0, str)

    const nextText = nextTextArr.join('')

    lineById[selectedLineId] = {
      ...lineById[selectedLineId],
    }

    lineById[selectedLineId].text = nextText
    lineById[selectedLineId].start += str.length
    lineById[selectedLineId].end += str.length
  } else {
    const startSelectedLineId = ids[selectedRange.start]

    const endSelectedLineId = ids[selectedRange.end]

    const startSelectedLine = lineById[startSelectedLineId]
    const endSelectedLine = lineById[endSelectedLineId]

    const nextStartTextArr = Array.from(startSelectedLine.text)
    const nextEndTextArr = Array.from(endSelectedLine.text)

    nextStartTextArr.splice(startSelectedLine.start, 0, str)
    nextEndTextArr.splice(endSelectedLine.end, 0, str)

    const nextStartText = nextStartTextArr.join('')
    const nextEndText = nextEndTextArr.join('')

    lineById[startSelectedLineId] = { ...lineById[startSelectedLineId] }
    lineById[startSelectedLineId].text = nextStartText
    lineById[startSelectedLineId].start += str.length
    lineById[endSelectedLineId] = { ...lineById[endSelectedLineId] }
    lineById[endSelectedLineId].text = nextEndText
  }

  return {
    actionHistory,
    ids,
    lineById,
    selectedRange,
  }
}

export default wrapSelection
