import { useCallback } from 'react'
import { nanoid } from 'nanoid'
import { EditorCoreRef } from '../useMarkdown'
import useContentStatus from '../useContentStatus'

const useHandleWrapSelection = (editorCoreRef: EditorCoreRef) => {
  const { getLineIndexById } = useContentStatus(editorCoreRef)

  return useCallback(() => {
    const finishedCallbacks: (() => void)[] = []

    const lastSelectedLineIds = editorCoreRef.current.lastSelectedLineIds
    const contentLineById = editorCoreRef.current.contentLineById
    const contentLineIds = editorCoreRef.current.contentLineIds
    const setContentLineById = editorCoreRef.current.setContentLineById
    const setContentLineIds = editorCoreRef.current.setContentLineIds

    const nextContentLineIds = [...contentLineIds]
    const nextContentLineById = { ...contentLineById }

    if (lastSelectedLineIds.length === 1) {
      const str = '`'
      const selectedLineId = lastSelectedLineIds[0]
      const selectedLine = contentLineById[selectedLineId]

      const nextTextArr = Array.from(nextContentLineById[selectedLineId].text)

      nextTextArr.splice(selectedLine.start, 0, str)
      nextTextArr.splice(selectedLine.end + 1, 0, str)

      const nextText = nextTextArr.join('')

      nextContentLineById[selectedLineId].text = nextText
      nextContentLineById[selectedLineId].start += str.length
      nextContentLineById[selectedLineId].end += str.length
      setContentLineById?.(nextContentLineById)
    } else {
      const str = '```'
      const startSelectedLineId = lastSelectedLineIds[0]

      const endSelectedLineId =
        lastSelectedLineIds[lastSelectedLineIds.length - 1]

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

        nextContentLineIds.splice(startIndex, 0, topId)
        nextContentLineIds.splice(endIndex + 2, 0, bottomId)

        setContentLineById?.(nextContentLineById)
        setContentLineIds?.(nextContentLineIds)
      }
    }

    return () => {
      finishedCallbacks.forEach((func) => {
        func()
      })
    }
  }, [editorCoreRef])
}

export default useHandleWrapSelection
