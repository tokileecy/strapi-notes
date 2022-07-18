import { ContentStatus } from '../hooks/useContentStatus'
import scope from './scope'
import wrapSelection from './wrapSelection'

const code = (contentStatus: ContentStatus): ContentStatus => {
  let { actionHistory, selectedRange, ids, lineById } = contentStatus

  lineById = { ...lineById }

  if (selectedRange.end - selectedRange.start === 0) {
    const str = '`'

    ;({ actionHistory, ids, lineById, selectedRange } = wrapSelection(
      {
        actionHistory,
        ids,
        lineById,
        selectedRange,
      },
      str
    ))
  } else {
    const str = '```'

    ;({ actionHistory, ids, lineById, selectedRange } = scope(
      {
        actionHistory,
        ids,
        lineById,
        selectedRange,
      },
      str
    ))
  }

  return {
    actionHistory,
    ids,
    lineById,
    selectedRange,
  }
}

export default code
