import { MutableRefObject, useEffect, useRef } from 'react'
import { isUnderLineContainer, isUnderToolbar } from '../utils'

interface DocumentStatus {
  prevIsKeyDown: boolean
  prevIsMouseDown: boolean
  isKeyDown: boolean
  isMouseDown: boolean
  isSelectionChange: boolean
  lastSelectionRange?: Range
  handleAnimationFrame: () => void
}

const useDodumentEvent = () => {
  const documentStatusRef = useRef<DocumentStatus>({
    prevIsKeyDown: false,
    prevIsMouseDown: false,
    isKeyDown: false,
    isMouseDown: false,
    isSelectionChange: false,
    handleAnimationFrame() {
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
        const ancestorContainer = range.commonAncestorContainer

        documentStatusRef.current.isSelectionChange = false

        if (isUnderLineContainer(ancestorContainer)) {
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

export default useDodumentEvent
