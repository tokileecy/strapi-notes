import { ContentStatus } from '../hooks/useContentStatus'

export const isSelectingWord = (contentStatus: ContentStatus) => {
  const { selectedRange, ids, lineById } = contentStatus
  let isSelectingWrod = false

  if (selectedRange.start !== -1 && selectedRange.end !== -1) {
    if (selectedRange.start === selectedRange.end) {
      const line = lineById[ids[selectedRange.start]]

      if (line.start !== -1 && line.end !== -1 && line.start !== line.end) {
        isSelectingWrod = true
      }
    } else {
      isSelectingWrod = true
    }
  }

  return isSelectingWrod
}
