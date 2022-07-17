import { nanoid } from 'nanoid'
import { LineState } from './hooks/useContentStatus'

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

export const selectionDetailEditorTypes = [
  'editor',
  'line-container',
  'line-wrapper',
  'line',
  'line-start',
  'line-center',
  'line-end',
  'line-input',
] as const

export type SelectionDetailType =
  | typeof selectionDetailEditorTypes[number]
  | 'none'

export interface SelectionDetail {
  type: SelectionDetailType
  isUnderEditor: boolean
  isUnderLineContainer: boolean
  isLine: boolean
  id: string
  start: number
  end: number
}

export const getSelectionDetailByNode = (element: Node) => {
  let current = element

  const startDetail: SelectionDetail = {
    type: 'none',
    id: '',
    start: -1,
    end: -1,
    get isLine() {
      return (
        this.type === 'line' ||
        this.type === 'line-start' ||
        this.type === 'line-center' ||
        this.type === 'line-end' ||
        this.type === 'line-input'
      )
    },
    get isUnderLineContainer() {
      return this.isLine || this.type === 'line-wrapper'
    },
    get isUnderEditor() {
      return this.isUnderLineContainer || this.type === 'line-container'
    },
  }

  let findEditorElement = false

  for (let i = 0; i < 9; i++) {
    if (current instanceof HTMLElement) {
      const type = current.dataset.type

      for (let j = 0; j < selectionDetailEditorTypes.length; j++) {
        if (type === selectionDetailEditorTypes[j]) {
          startDetail.type = type
          findEditorElement = true
          break
        }
      }
    }

    if (findEditorElement) {
      if (
        startDetail.type === 'line-start' ||
        startDetail.type === 'line-center' ||
        startDetail.type === 'line-end' ||
        startDetail.type === 'line-input'
      ) {
        const lineElement = current.parentElement as HTMLElement

        startDetail.id = lineElement.dataset.id ?? ''
        startDetail.start = Number(lineElement.dataset.start) ?? -1
        startDetail.end = Number(lineElement.dataset.end) ?? -1
      } else if (startDetail.type === 'line') {
        const lineElement = current as HTMLElement

        startDetail.id = lineElement.dataset.id ?? ''
        startDetail.start = Number(lineElement.dataset.start) ?? -1
        startDetail.end = Number(lineElement.dataset.end) ?? -1
      }

      break
    }

    if (current.parentElement) {
      current = current.parentElement
    } else {
      break
    }
  }

  return startDetail
}

export const isUnderLineContainer = (element: Node) => {
  let current = element

  for (let i = 0; i < 5; i++) {
    if (
      current instanceof HTMLElement &&
      current.dataset.type === 'line-container'
    ) {
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

export const getLineIdByElement = (element: Node) => {
  let current = element
  let id = ''

  for (let i = 0; i < 5; i++) {
    if (
      current instanceof HTMLElement &&
      current.dataset.type === 'line-wrapper'
    ) {
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

export const getChangeSelectLinesOptionsByRange = (
  ids: string[],
  range: Range
) => {
  const startDetail = getSelectionDetailByNode(range.startContainer)

  const endDetail = getSelectionDetailByNode(range.endContainer)

  let start = range.startOffset
  let end = range.endOffset

  const startIndex = getLineIndexById(
    ids,
    getLineIdByElement(range.startContainer)
  )

  const endIndex = getLineIndexById(ids, getLineIdByElement(range.endContainer))

  if (startDetail.type === 'line-input') {
    start = startDetail.start
  } else if (startDetail.type === 'line-center') {
    start = startDetail.start + start
  } else if (startDetail.type === 'line-end') {
    start = startDetail.end + start
  }

  if (endDetail.type === 'line-input') {
    end = endDetail.start
  } else if (endDetail.type === 'line-center') {
    end = endDetail.start + end
  } else if (endDetail.type === 'line-end') {
    end = endDetail.end + end
  }

  return {
    selectedRange: {
      start: startIndex,
      end: endIndex,
    },
    line: { start, end },
  }
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

export const markdownToContentStatus = (markdownContext: string) => {
  const nextLines = markdownContext.split('\n')

  const ids: string[] = []
  const lineById: Record<string, LineState> = {}

  nextLines.forEach((line: string) => {
    const id = nanoid(6)

    ids.push(id)
    lineById[id] = {
      text: line,
      inputText: '',
      start: 0,
      end: 0,
    }
  })

  return {
    ids,
    lineById,
  }
}
