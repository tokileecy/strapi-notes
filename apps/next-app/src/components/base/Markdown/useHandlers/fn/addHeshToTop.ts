import { ContentStatus } from '../../useMarkdown'

const addHeshToTop = (contentStatus: ContentStatus): ContentStatus => {
  let { selectedEndLineId, lastSelectedLineIds, ids, lineById } = contentStatus

  lineById = { ...contentStatus.lineById }

  contentStatus.lastSelectedLineIds.forEach((selectedLineId) => {
    const selectedLine = lineById[selectedLineId]

    let targetToAdd = '#'

    if (selectedLine.text[0] !== '#') {
      targetToAdd += ' '
    }

    lineById[selectedLineId] = { ...lineById[selectedLineId] }
    lineById[selectedLineId].text = `${targetToAdd}${selectedLine.text}`
    lineById[selectedLineId].start += targetToAdd.length
    lineById[selectedLineId].end += targetToAdd.length
  })
  return {
    ids,
    lineById,
    lastSelectedLineIds,
    selectedEndLineId,
  }
}

export default addHeshToTop
