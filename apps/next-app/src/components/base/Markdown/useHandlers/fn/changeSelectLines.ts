import { ContentStatus } from '../../useMarkdown'
import { getSelectedIdsByIndexRange } from '../../utils'

export interface ChangeSelectLinesOptions {
  selectedRange?: { start: number; end: number }
  line?: { start: number; end: number }
}

const changeSelectLines = (
  contentStatus: ContentStatus,
  options: ChangeSelectLinesOptions = {}
): ContentStatus => {
  let { actionHistory, selectedRange, ids, lineById, inputIndex } =
    contentStatus

  const prevSelectedLineIds = getSelectedIdsByIndexRange(ids, selectedRange)

  actionHistory = [...actionHistory, 'change-select-lines']
  lineById = { ...lineById }

  if (inputIndex !== -1) {
    inputIndex = -1
  }

  if (options.selectedRange) {
    selectedRange = {
      start: options.selectedRange.start,
      end: options.selectedRange.end,
    }

    const nextSelectedLineIds = getSelectedIdsByIndexRange(ids, selectedRange)
    const startLineId = ids[selectedRange.start]
    const endLineId = ids[selectedRange.end]

    if (options.line) {
      for (
        let i = options.selectedRange.start + 1;
        i < options.selectedRange.end;
        i++
      ) {
        nextSelectedLineIds.forEach((id) => {
          lineById[id] = {
            ...lineById[id],
            start: 0,
            end: lineById[id].text.length,
          }
        })
      }

      if (options.selectedRange.end - options.selectedRange.start === 0) {
        lineById[startLineId] = {
          ...lineById[startLineId],
          start: options.line.start,
          end: options.line.end,
        }
      } else {
        lineById[startLineId] = {
          ...lineById[startLineId],
          start: options.line.start,
          end: lineById[startLineId].text.length,
        }

        lineById[endLineId] = {
          ...lineById[endLineId],
          start: 0,
          end: options.line.end,
        }
      }
    } else {
      selectedRange.start = selectedRange.end
      prevSelectedLineIds.forEach((id) => {
        lineById[id] = {
          ...lineById[id],
          start: 0,
          end: 0,
        }
      })
      lineById[endLineId] = {
        ...lineById[endLineId],
        start: lineById[endLineId].end,
      }
    }
  } else {
    selectedRange = {
      ...selectedRange,
      start: selectedRange.end,
    }

    if (options.line) {
      const lineId = ids[selectedRange.end]

      lineById[lineId] = {
        ...lineById[lineId],
        start: options.line.start,
        end: options.line.end,
      }
    }
  }

  if (selectedRange.end !== -1) {
    inputIndex = selectedRange.end
  }

  return { actionHistory, selectedRange, ids, lineById, inputIndex }
}

export default changeSelectLines
