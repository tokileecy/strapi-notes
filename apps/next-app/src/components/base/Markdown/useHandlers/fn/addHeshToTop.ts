import { ContentStatus } from '../../useMarkdown'
import { getSelectedIdsByIndexRange } from '../../utils'

const addHeshToTop = (contentStatus: ContentStatus): ContentStatus => {
  let { actionHistory, selectedRange, ids, lineById, inputIndex } =
    contentStatus

  actionHistory = [...actionHistory, 'add-hesh-to-top']
  lineById = { ...contentStatus.lineById }

  const lastSelectedLineIds = getSelectedIdsByIndexRange(
    contentStatus.ids,
    contentStatus.selectedRange
  )

  lastSelectedLineIds.forEach((selectedLineId) => {
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
    actionHistory,
    ids,
    lineById,
    selectedRange,
    inputIndex,
  }
}

export default addHeshToTop
