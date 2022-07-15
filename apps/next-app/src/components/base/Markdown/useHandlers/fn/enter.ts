import { nanoid } from 'nanoid'
import { FnProps } from './types'
import { EditorCoreRef } from '../../useMarkdown'
import { getLineIndexById } from '../../utils'
import handleBackspace from './backspace'

const handleEnter = (
  editorCoreRef: EditorCoreRef,
  options: FnProps
): FnProps => {
  let {
    contentLineIds,
    contentLineById,
    selectedEndLineId,
    lastSelectedLineIds,
  } = options

  if (
    lastSelectedLineIds.length > 1 ||
    contentLineById[lastSelectedLineIds[0]].start !==
      contentLineById[lastSelectedLineIds[0]].end
  ) {
    ;({
      contentLineIds,
      contentLineById,
      selectedEndLineId,
      lastSelectedLineIds,
    } = handleBackspace(editorCoreRef, {
      contentLineIds,
      contentLineById,
      selectedEndLineId,
      lastSelectedLineIds,
    }))
  }

  const lineIndex = getLineIndexById(editorCoreRef, selectedEndLineId)

  if (lineIndex !== undefined) {
    if (contentLineById[lastSelectedLineIds[0]].start === 0) {
      const newLineId = nanoid(6)

      contentLineIds = [...contentLineIds]
      contentLineIds.splice(lineIndex, 0, newLineId)

      contentLineById[newLineId] = {
        text: '',
        input: false,
        start: 0,
        end: 0,
      }
    } else {
      const newLineId = nanoid(6)
      const selectedLine = contentLineById[selectedEndLineId]

      const nextSelectedLineText = selectedLine.text.slice(
        0,
        selectedLine.start
      )

      const newLineText = selectedLine.text.slice(
        selectedLine.end,
        selectedLine.text.length
      )

      contentLineIds = [...contentLineIds]
      contentLineIds.splice(lineIndex + 1, 0, newLineId)

      contentLineById[newLineId] = {
        text: newLineText,
        input: false,
        start: 0,
        end: 0,
      }

      contentLineById[selectedEndLineId] = {
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
    contentLineIds,
    contentLineById,
    selectedEndLineId,
    lastSelectedLineIds,
  }
}

export default handleEnter
