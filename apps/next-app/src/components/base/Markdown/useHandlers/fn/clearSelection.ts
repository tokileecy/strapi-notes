import { ContentStatus } from '../../useMarkdown'
import { getSelectedIdsByIndexRange } from '../../utils'

const clearSelection = (contentStatus: ContentStatus) => {
  let { actionHistory, selectedRange, ids, lineById } = contentStatus

  const selectedLineIds = getSelectedIdsByIndexRange(ids, selectedRange)

  actionHistory = [...actionHistory, 'clear-selection']
  selectedRange = { ...selectedRange }
  lineById = { ...lineById }

  if (selectedRange.end !== -1) {
    lineById[ids[selectedRange.end]].input = false
  }

  for (let i = selectedRange.start; i <= selectedRange.end; i++) {
    selectedLineIds.forEach((id) => {
      lineById[id] = {
        ...lineById[id],
        start: 0,
        end: 0,
      }
    })
  }

  selectedRange.start = selectedRange.end
  return { actionHistory, selectedRange, ids, lineById }
}

export default clearSelection