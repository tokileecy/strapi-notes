import { useCallback } from 'react'
import { nanoid } from 'nanoid'
import { EditorCoreRef } from '../useMarkdown'
import useContentStatus from '../useContentStatus'

const useHandleWrapSelection = (editorCoreRef: EditorCoreRef) => {
  const { getLineIndexById } = useContentStatus(editorCoreRef)

  return useCallback(() => {
    const finishedCallbacks: (() => void)[] = []

    const contentStatus = editorCoreRef.current.contentStatus
    const setContentStatus = editorCoreRef.current.setContentStatus

    let nextContentLineIds = contentStatus.ids
    const nextContentLineById = { ...contentStatus.lineById }

    if (contentStatus.lastSelectedLineIds.length === 1) {
      const str = '`'
      const selectedLineId = contentStatus.lastSelectedLineIds[0]
      const selectedLine = nextContentLineById[selectedLineId]

      const nextTextArr = Array.from(nextContentLineById[selectedLineId].text)

      nextTextArr.splice(selectedLine.start, 0, str)
      nextTextArr.splice(selectedLine.end + 1, 0, str)

      const nextText = nextTextArr.join('')

      nextContentLineById[selectedLineId].text = nextText
      nextContentLineById[selectedLineId].start += str.length
      nextContentLineById[selectedLineId].end += str.length
    } else {
      const str = '```'
      const startSelectedLineId = contentStatus.lastSelectedLineIds[0]

      const endSelectedLineId =
        contentStatus.lastSelectedLineIds[
          contentStatus.lastSelectedLineIds.length - 1
        ]

      const startIndex = getLineIndexById(startSelectedLineId)
      const endIndex = getLineIndexById(endSelectedLineId)

      if (startIndex !== undefined && endIndex !== undefined) {
        const topId = nanoid(6)

        const bottomId = nanoid(6)

        nextContentLineById[topId] = {
          start: 0,
          text: str,
          end: 0,
          input: false,
        }
        nextContentLineById[bottomId] = {
          start: 0,
          text: str,
          end: 0,
          input: false,
        }

        nextContentLineIds = [...nextContentLineIds]
        nextContentLineIds.splice(startIndex, 0, topId)
        nextContentLineIds.splice(endIndex + 2, 0, bottomId)
      }
    }

    setContentStatus?.({
      ids: nextContentLineIds,
      lineById: nextContentLineById,
    })

    return () => {
      finishedCallbacks.forEach((func) => {
        func()
      })
    }
  }, [editorCoreRef])
}

export default useHandleWrapSelection
