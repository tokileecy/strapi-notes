import { ContentStatus } from '../../useMarkdown'

const wrapSelection = (
  contentStatus: ContentStatus,
  str: string
): ContentStatus => {
  let { selectedEndLineId, lastSelectedLineIds, ids, lineById } = contentStatus

  lineById = { ...lineById }

  if (lastSelectedLineIds.length === 1) {
    const selectedLineId = lastSelectedLineIds[0]
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
    const startSelectedLineId = lastSelectedLineIds[0]

    const endSelectedLineId =
      lastSelectedLineIds[lastSelectedLineIds.length - 1]

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
    lineById[endSelectedLineId].text = nextEndText
  }

  return {
    ids,
    lineById,
    lastSelectedLineIds,
    selectedEndLineId,
  }
}

export default wrapSelection
