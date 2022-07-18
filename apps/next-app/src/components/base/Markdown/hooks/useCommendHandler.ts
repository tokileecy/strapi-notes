import { useRef } from 'react'
import { Handlers } from './useCoreHandlers'

export type EditorCommendEvent =
  | 'bold'
  | 'italic'
  | 'strike'
  | 'header'
  | 'code'
  | 'html'

export interface CommendHandler {
  commendQueue: EditorCommendEvent[]
  update: () => void
  commend: (event: EditorCommendEvent) => void
}

const useCommendHandler = (handlers: Handlers) => {
  const commendHandlerRef = useRef<CommendHandler>({
    commendQueue: [],
    update() {
      while (this.commendQueue.length > 0) {
        const commend = this.commendQueue.shift()

        switch (commend) {
          case 'bold':
            handlers.handleBold()
            break
          case 'italic':
            handlers.handleItalic()
            break
          case 'strike':
            handlers.handleStrike()
            break
          case 'header':
            handlers.handleHeader()
            break
          case 'code':
            handlers.handleCode()
            break
          case 'html':
            handlers.handleHtml()
            break
          default:
            break
        }
      }
    },
    commend(event: EditorCommendEvent) {
      this.commendQueue.push(event)
    },
  })

  return commendHandlerRef
}

export default useCommendHandler
