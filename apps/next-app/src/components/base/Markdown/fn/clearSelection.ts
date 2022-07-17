import { ContentStatus } from '../hooks/useContentStatus'

const clearSelection = (contentStatus: ContentStatus): ContentStatus => {
  let { actionHistory, selectedRange, ids, lineById } = contentStatus

  actionHistory = [...actionHistory, 'clear-selection']
  selectedRange = { ...selectedRange }
  lineById = { ...lineById }

  if (selectedRange.start !== -1 && selectedRange.end !== -1) {
    for (let i = selectedRange.start; i < selectedRange.end; i++) {
      const id = ids[i]

      lineById[id] = {
        ...lineById[id],
        start: 0,
        end: 0,
      }
    }

    lineById[ids[selectedRange.end]] = {
      ...lineById[ids[selectedRange.end]],
      start: lineById[ids[selectedRange.end]].end,
    }
  }

  selectedRange.start = selectedRange.end
  return { actionHistory, selectedRange, ids, lineById }
}

export default clearSelection
