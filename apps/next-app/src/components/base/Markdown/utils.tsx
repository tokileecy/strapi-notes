import { MutableRefObject } from 'react'
import { EditorCoreRefData } from './useMarkdown'

export const refreshCursorBySelection = (
  containerElement: HTMLDivElement,
  cursorElement: HTMLDivElement,
  endRange: Range
) => {
  const endRect = endRange.getBoundingClientRect()
  const containerRect = containerElement.getBoundingClientRect()

  if (endRect && cursorElement) {
    cursorElement.style.left = `${
      endRect.x - containerRect.x + endRect.width
    }px`
    cursorElement.style.top = `${endRect.y - containerRect.y}px`
  }
}

export const refreshCursorByElement = (
  containerElement: HTMLDivElement,
  cursorElement: HTMLDivElement,
  element: HTMLElement
) => {
  const endRect = element.getBoundingClientRect()
  const containerRect = containerElement.getBoundingClientRect()

  if (endRect && cursorElement) {
    cursorElement.style.left = `${
      endRect.x - containerRect.x + endRect.width
    }px`
    cursorElement.style.top = `${endRect.y - containerRect.y}px`
  }
}

export const isUnderEditor = (element: Node) => {
  let current = element

  for (let i = 0; i < 5; i++) {
    if (current instanceof HTMLElement && current.dataset.type === 'editor') {
      return true
    }

    if (current.parentElement) {
      current = current.parentElement
    } else {
      break
    }
  }

  return false
}

export const findLineElement = (element: Node) => {
  let lineElement: HTMLElement | null = null

  for (let i = 0; i < 5; i++) {
    if (element instanceof HTMLElement && element.dataset.type === 'line') {
      lineElement = element
      break
    }

    if (element.parentElement) {
      element = element.parentElement
    } else {
      break
    }
  }

  return lineElement
}

export const isUnderToolbar = (element: Element) => {
  let current = element

  for (let i = 0; i < 5; i++) {
    if (current instanceof HTMLElement && current.dataset.type === 'tool-bar') {
      return true
    }

    if (current.parentElement) {
      current = current.parentElement
    } else {
      break
    }
  }

  return false
}

export const getLineIndexById = (
  editorCoreRef: MutableRefObject<EditorCoreRefData>,
  lineId: string
) => {
  let targetIndex = -1

  const contentLineIds = editorCoreRef.current.contentStatus.ids

  for (let i = 0; i < contentLineIds.length; i++) {
    const id = contentLineIds[i]

    if (id === lineId) {
      targetIndex = i
      break
    }
  }

  return targetIndex
}

export const getLineIdByElement = (element: Node) => {
  let current = element
  let id = ''

  for (let i = 0; i < 5; i++) {
    if (current instanceof HTMLElement && current.dataset.type === 'wrapper') {
      id = current.dataset.id ?? ''
      break
    }

    if (current.parentElement) {
      current = current.parentElement
    } else {
      break
    }
  }

  return id
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
  // const cache = selectedIdsByIndexRangeCache.getCache(ids, indexRange)

  // if (cache) {
  //   return cache
  // } else {
  //   const res = []

  //   if (indexRange.start !== -1 && indexRange.end !== -1) {
  //     for (let i = indexRange.start; i <= indexRange.end; i++) {
  //       res.push(ids[i])
  //     }
  //   }

  //   selectedIdsByIndexRangeCache.setCache(ids, indexRange, res)
  //   return res
  // }
  const res = []

  if (indexRange.start !== -1 && indexRange.end !== -1) {
    for (let i = indexRange.start; i <= indexRange.end; i++) {
      res.push(ids[i])
    }
  }

  return res
}
