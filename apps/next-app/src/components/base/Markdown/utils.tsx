import { nanoid } from 'nanoid'
import { getLineIndexById } from './fn/utils'
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

export const refreshCursorByPosition = (
  cursorElement: HTMLDivElement,
  x: number,
  y: number
) => {
  cursorElement.style.left = `${x}px`
  cursorElement.style.top = `${y}px`
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

export const getLineElementsById = (id: string) => {
  const lineElement = document.querySelector(
    `[data-type="line"][data-id="${id}"]`
  )

  const lineStartElement = lineElement?.childNodes[0] ?? null
  const lineCenterElement = lineElement?.childNodes[1] ?? null
  const lineInputElement = lineElement?.childNodes[2] ?? null
  const lineEndElement = lineElement?.childNodes[3] ?? null

  return {
    lineElement,
    lineStartElement,
    lineCenterElement,
    lineInputElement,
    lineEndElement,
  }
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
  let findOuteElement = null

  for (let i = 0; i < 9; i++) {
    if (current instanceof HTMLElement) {
      const type = current.dataset.type

      for (let j = 0; j < selectionDetailEditorTypes.length; j++) {
        if (type === selectionDetailEditorTypes[j]) {
          startDetail.type = type
          findEditorElement = true
          findOuteElement = current
          break
        }
      }
    }

    if (findEditorElement && findOuteElement) {
      if (
        startDetail.type === 'line-start' ||
        startDetail.type === 'line-center' ||
        startDetail.type === 'line-end' ||
        startDetail.type === 'line-input'
      ) {
        const lineElement = findOuteElement.parentElement as HTMLElement

        startDetail.id = lineElement.dataset.id ?? ''
        startDetail.start = Number(lineElement.dataset.start) ?? -1
        startDetail.end = Number(lineElement.dataset.end) ?? -1
      } else if (startDetail.type === 'line') {
        const lineElement = findOuteElement as HTMLElement

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

export const getLineIdByElement = (element: Node) => {
  let current = element
  let id = ''

  for (let i = 0; i < 5; i++) {
    if (current instanceof HTMLElement && current.dataset.type === 'line') {
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

  let location: 'up' | 'down' = 'up'

  if (
    endDetail.id !== '' &&
    end === start &&
    (range.endContainer.textContent?.length ?? 0) < 0
  ) {
    const currentCharRange = new Range()

    currentCharRange.setStart(range.endContainer, end)
    currentCharRange.setEnd(range.endContainer, end)

    const currentCharRect = currentCharRange.getBoundingClientRect()
    const nextCharRange = new Range()

    nextCharRange.setStart(range.endContainer, end + 1)
    nextCharRange.setEnd(range.endContainer, end + 1)

    const nextCharRect = nextCharRange.getBoundingClientRect()

    if (currentCharRect.y !== nextCharRect.y) {
      location = 'down'
    }
  }

  return {
    selectedRange: {
      start: startIndex,
      end: endIndex,
      location,
    },
    line: { start, end },
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
