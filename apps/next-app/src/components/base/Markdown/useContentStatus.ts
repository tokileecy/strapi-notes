import { useMemo } from 'react'
import { EditorCoreRef } from './useMarkdown'

const useContentStatus = (editorCoreRef: EditorCoreRef) => {
  return useMemo(() => {
    const getLineIndexById = (lineId: string) => {
      let targetIndex: number | undefined

      const lineIds = editorCoreRef.current.contentStatus.ids

      for (let i = 0; i < lineIds.length; i++) {
        const id = lineIds[i]

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
