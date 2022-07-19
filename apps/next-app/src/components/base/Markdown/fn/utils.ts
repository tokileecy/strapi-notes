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

export const isSelectingMultiLines = (contentStatus: ContentStatus) => {
  const { selectedRange } = contentStatus

  if (selectedRange.start !== -1 && selectedRange.end !== -1) {
    return selectedRange.start !== selectedRange.end
  }

  return false
}

export const getLineIndexById = (lineIds: string[], lineId: string) => {
  let targetIndex = -1

  for (let i = 0; i < lineIds.length; i++) {
    const id = lineIds[i]

    if (id === lineId) {
      targetIndex = i
      break
    }
  }

  return targetIndex
}

const selectedIdsByIndexRangeCache = (() => {
  let lastIds: string[] = []
  let lastIndexRange = { start: -1, end: -1 }
  let lastRes: string[] = []

  return {
    getCache: (
      ids: string[],
      indexRange: {
        start: number
        end: number
      }
    ) => {
      if (lastIds === ids && indexRange === lastIndexRange) {
        return lastRes
      } else {
        return null
      }
    },
    setCache: (
      ids: string[],
      indexRange: {
        start: number
        end: number
      },
      res: string[]
    ) => {
      lastIds = ids
      lastIndexRange = indexRange
      lastRes = res
    },
  }
})()

export const getSelectedIdsByIndexRange = (
  ids: string[],
  indexRange: {
    start: number
    end: number
  }
) => {
  const cache = selectedIdsByIndexRangeCache.getCache(ids, indexRange)

  if (cache) {
    return cache
  } else {
    const res = []

    if (indexRange.start !== -1 && indexRange.end !== -1) {
      for (let i = indexRange.start; i <= indexRange.end; i++) {
        res.push(ids[i])
      }
    }

    selectedIdsByIndexRangeCache.setCache(ids, indexRange, res)
    return res
  }
}
