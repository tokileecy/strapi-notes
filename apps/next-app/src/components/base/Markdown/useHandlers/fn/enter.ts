import { nanoid } from 'nanoid'
import { EditorCoreRef, ContentStatus } from '../../useMarkdown'
import { getLineIndexById } from '../../utils'
import handleBackspace from './backspace'

const handleEnter = (
  editorCoreRef: EditorCoreRef,
  options: ContentStatus
): ContentStatus => {
  let { ids, lineById, selectedEndLineId, lastSelectedLineIds } = options

  if (
    lastSelectedLineIds.length > 1 ||
    lineById[lastSelectedLineIds[0]].start !==
      lineById[lastSelectedLineIds[0]].end
  ) {
    ;({ ids, lineById, selectedEndLineId, lastSelectedLineIds } =
      handleBackspace(editorCoreRef, {
        ids,
        lineById,
        selectedEndLineId,
        lastSelectedLineIds,
      }))
  }

  const lineIndex = getLineIndexById(editorCoreRef, selectedEndLineId)

  if (lineIndex !== undefined) {
    if (lineById[lastSelectedLineIds[0]].start === 0) {
      const newLineId = nanoid(6)

      ids = [...ids]
      ids.splice(lineIndex, 0, newLineId)

      lineById[newLineId] = {
        text: '',
        input: false,
        start: 0,
        end: 0,
      }
    } else {
      const newLineId = nanoid(6)
      const selectedLine = lineById[selectedEndLineId]

      const nextSelectedLineText = selectedLine.text.slice(
        0,
        selectedLine.start
      )

      const newLineText = selectedLine.text.slice(
        selectedLine.end,
        selectedLine.text.length
      )

      ids = [...ids]
      ids.splice(lineIndex + 1, 0, newLineId)

      lineById[newLineId] = {
        text: newLineText,
        input: false,
        start: 0,
        end: 0,
      }

      lineById[selectedEndLineId] = {
        text: nextSelectedLineText,
        input: false,
        start: 0,
        end: 0,
      }

      lastSelectedLineIds = [newLineId]
      selectedEndLineId = newLineId
    }
  }

  return {
    ids,
    lineById,
    selectedEndLineId,
    lastSelectedLineIds,
  }
}

export default handleEnter
