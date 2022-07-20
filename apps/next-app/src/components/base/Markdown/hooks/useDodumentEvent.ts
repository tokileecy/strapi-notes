import { MutableRefObject, useEffect, useRef } from 'react'
import { getSelectionDetailByNode, isUnderToolbar } from '../utils'

export type DocumentEvent = 'clickdown' | 'clickup' | 'select'

export interface DocumentStatus {
  prevIsKeyDown: boolean
  prevIsMouseDown: boolean
  isKeyDown: boolean
  isMouseDown: boolean
  isSelectionChange: boolean
  lastSelectionRange?: Range
  lastClickPos: { x: number; y: number }
  queue: Record<DocumentEvent, Set<() => void>>
  on: (event: DocumentEvent, callback: () => void) => void
  off: (event: DocumentEvent, callback: () => void) => void
  update: () => void
}

const useDodumentHandler = () => {
  const documentStatusRef = useRef<DocumentStatus>({
    prevIsKeyDown: false,
    prevIsMouseDown: false,
    isKeyDown: false,
    isMouseDown: false,
    isSelectionChange: false,
    lastClickPos: { x: -1, y: -1 },
    queue: {
      'clickdown': new Set(),
      'clickup': new Set(),
      'select': new Set(),
    },
    on(event: DocumentEvent, callback: () => void) {
      this.queue[event].add(callback)
    },
    off(event: DocumentEvent, callback: () => void) {
      this.queue[event].delete(callback)
    },
    update() {
      if (this.isSelectionChange) {
        this.queue.select.forEach((callback) => {
          callback()
        })
      }

      if (
        documentStatusRef.current.isMouseDown &&
        !documentStatusRef.current.prevIsMouseDown
      ) {
        this.queue.clickdown.forEach((callback) => {
          callback()
        })
      }

      if (
        !documentStatusRef.current.isMouseDown &&
        documentStatusRef.current.prevIsMouseDown
      ) {
        this.queue.clickup.forEach((callback) => {
          callback()
        })
      }

      this.prevIsKeyDown = this.isKeyDown
      this.prevIsMouseDown = this.isMouseDown
      this.isSelectionChange = false
    },
  })

  useEffect(() => {
    const handleKeydown = () => {
      documentStatusRef.current.isKeyDown = true
    }

    const handleMouseup = () => {
      documentStatusRef.current.isMouseDown = false
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (e.target) {
        if (!isUnderToolbar(e.target as Element)) {
          documentStatusRef.current.isMouseDown = true
          documentStatusRef.current.lastClickPos = {
            x: e.x,
            y: e.y,
          }
        }
      }
    }

    const handleKeyup = () => {
      documentStatusRef.current.isKeyDown = false
    }

    const handleSelect = () => {
      const selection = window.getSelection()

      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)

        const nodeDetail = getSelectionDetailByNode(
          range.commonAncestorContainer
        )

        documentStatusRef.current.isSelectionChange = false

        if (
          nodeDetail.isUnderLineContainer ||
          nodeDetail.type === 'line-container'
        ) {
          documentStatusRef.current.isSelectionChange = true
          documentStatusRef.current.lastSelectionRange = range
        }
      }
    }

    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('keyup', handleKeyup)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseup)
    document.addEventListener('selectionchange', handleSelect)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
      document.removeEventListener('keyup', handleKeyup)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseup)
      document.removeEventListener('selectionchange', handleSelect)
    }
  }, [])

  return documentStatusRef
}

export type DocumentStatusRef = MutableRefObject<DocumentStatus>

export default useDodumentHandler
