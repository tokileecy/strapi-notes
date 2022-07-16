import { ContentStatus } from '../../useMarkdown'

const code = (contentStatus: ContentStatus, word: string): ContentStatus => {
  let { actionHistory, selectedRange, ids, lineById, inputIndex } =
    contentStatus

  selectedRange = { ...selectedRange }
  actionHistory = [...actionHistory, 'add-word']
  lineById = { ...lineById }

  const inputLineId = ids[inputIndex]
  const nextLine = { ...lineById[inputLineId] }
  const nextTextArr = Array.from(nextLine.text)

  nextTextArr.splice(nextLine.start, 0, word)

  nextLine.text = nextTextArr.join('')
  nextLine.inputText = ''
  nextLine.start += word.length
  nextLine.end += word.length
  lineById[inputLineId] = {
    ...nextLine,
  }

  return {
    actionHistory,
    ids,
    lineById,
    selectedRange,
    inputIndex,
  }
}

export default code
