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

export const isUnderEditor = (element: Element) => {
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
