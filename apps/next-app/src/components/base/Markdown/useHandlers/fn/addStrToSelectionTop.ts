import { ContentStatus } from '../../useMarkdown'

const addHeshToTop = (
  contentStatus: ContentStatus,
  str: string
): ContentStatus => {
  let { selectedEndLineId, lastSelectedLineIds, ids, lineById } = contentStatus

  lineById = { ...contentStatus.lineById }

  contentStatus.lastSelectedLineIds.forEach((selectedLineId) => {
    const selectedLine = lineById[selectedLineId]

    lineById[selectedLineId] = { ...lineById[selectedLineId] }
    lineById[selectedLineId].text = `${str}${selectedLine.text}`
    lineById[selectedLineId].start += str.length
    lineById[selectedLineId].end += str.length
  })

  return {
    ids,
    lineById,
    lastSelectedLineIds,
    selectedEndLineId,
  }
}

export default addHeshToTop
