import { useMemo } from 'react'
import { EditorCoreRef } from './useMarkdown'

const useContentStatus = (editorCoreRef: EditorCoreRef) => {
  return useMemo(() => {
    const getLineIndexById = (lineId: string) => {
      let targetIndex: number | undefined

      const contentLineIds = editorCoreRef.current.contentLineIds

      for (let i = 0; i < contentLineIds.length; i++) {
        const id = contentLineIds[i]

        if (id === lineId) {
          targetIndex = i
          break
        }
      }

      return targetIndex
    }

    return {
      getLineIndexById,
    }
  }, [editorCoreRef])
}

export default useContentStatus
