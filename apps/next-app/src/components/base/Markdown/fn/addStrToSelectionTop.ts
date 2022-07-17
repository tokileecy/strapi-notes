import { ContentStatus } from '../hooks/useMarkdown'
import { getSelectedIdsByIndexRange } from '../utils'

const addStrToTop = (
  contentStatus: ContentStatus,
  str: string
): ContentStatus => {
  let { actionHistory, selectedRange, ids, lineById } = contentStatus

  actionHistory = [...actionHistory, 'add-str-to-top']
  lineById = { ...contentStatus.lineById }

  const lastSelectedLineIds = getSelectedIdsByIndexRange(
    contentStatus.ids,
    contentStatus.selectedRange
  )

  lastSelectedLineIds.forEach((selectedLineId) => {
    const selectedLine = lineById[selectedLineId]

    lineById[selectedLineId] = { ...lineById[selectedLineId] }
    lineById[selectedLineId].text = `${str}${selectedLine.text}`
    lineById[selectedLineId].start += str.length
    lineById[selectedLineId].end += str.length
  })

  return {
    actionHistory,
    ids,
    lineById,
    selectedRange,
  }
}

export default addStrToTop
