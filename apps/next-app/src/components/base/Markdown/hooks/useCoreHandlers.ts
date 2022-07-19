import { Dispatch, useMemo, useRef } from 'react'
import * as fn from '../fn'
import { ChangeSelectLinesOptions } from '../fn/changeSelectLines'
import { ContentStatus, SetContentStatusAction } from './useContentStatus'

interface Config {
  cursorNeedUpdate?: boolean
  handleFinished?: () => void
}

const defaultConfig: Config = {
  cursorNeedUpdate: true,
}

export type HandlerEvent = 'cursorchange'

export interface HandlerStatus {
  commendCallbackQueue: (() => void)[]
  cursorNeedUpdate: boolean
  queue: Record<HandlerEvent, Set<() => void>>
  on: (event: HandlerEvent, callback: () => void) => void
  off: (event: HandlerEvent, callback: () => void) => void
  update: () => void
  noticeCursorNeedUpdate: () => void
}

const useCoreHandlers = (
  setContentStatus: Dispatch<SetContentStatusAction>
) => {
  const handlerStatusRef = useRef<HandlerStatus>({
    commendCallbackQueue: [],
    cursorNeedUpdate: false,
    queue: {
      cursorchange: new Set(),
    },
    on(event: HandlerEvent, callback: () => void) {
      this.queue[event].add(callback)
    },
    off(event: HandlerEvent, callback: () => void) {
      this.queue[event].delete(callback)
    },
    update() {
      if (this.cursorNeedUpdate) {
        this.queue.cursorchange.forEach((callback) => {
          callback()
        })
        this.cursorNeedUpdate = false
      }

      while (this.commendCallbackQueue.length > 0) {
        const callback = this.commendCallbackQueue.shift()

        if (callback) {
          try {
            callback()
          } catch (error) {
            console.error(error)
          }
        }
      }
    },
    noticeCursorNeedUpdate() {
      this.cursorNeedUpdate = true
    },
  })

  const handlers = useMemo(() => {
    const withContentStatus = (
      func: (contentStatus: ContentStatus) => ContentStatus
    ): ((config?: Config) => void) => {
      return (config: Config = defaultConfig) => {
        setContentStatus((prev) => func(prev))

        handlerStatusRef.current.commendCallbackQueue.push(() => {
          if (config.cursorNeedUpdate) {
            handlerStatusRef.current.cursorNeedUpdate = true
          }

          config.handleFinished?.()
        })
      }
    }

    const withContentStatusWithOptions = <T>(
      func: (contentStatus: ContentStatus, option: T) => ContentStatus
    ): ((option: T, config?: Config) => void) => {
      return (option: T, config: Config = defaultConfig) => {
        setContentStatus((prev) => func(prev, option))

        handlerStatusRef.current.commendCallbackQueue.push(() => {
          if (config.cursorNeedUpdate) {
            handlerStatusRef.current.cursorNeedUpdate = true
          }

          config.handleFinished?.()
        })
      }
    }

    return {
      handleBold: withContentStatus((contentStatus) => {
        return fn.wrapSelection(contentStatus, '**')
      }),
      handleItalic: withContentStatus((contentStatus) => {
        return fn.wrapSelection(contentStatus, '*')
      }),
      handleStrike: withContentStatus((contentStatus) => {
        return fn.wrapSelection(contentStatus, '~~')
      }),
      handleHtml: withContentStatus((contentStatus) => {
        return fn.scope(contentStatus, '<>')
      }),
      handleHeader: withContentStatus((contentStatus) => {
        return fn.addHeshToTop(contentStatus)
      }),
      handleQuote: withContentStatus((contentStatus) => {
        return fn.addStrToSelectionTop(contentStatus, '> ')
      }),
      handleListBullet: withContentStatus((contentStatus) => {
        return fn.addStrToSelectionTop(contentStatus, '* ')
      }),
      handleListNumber: withContentStatus((contentStatus) => {
        return fn.addStrToSelectionTop(contentStatus, '1. ')
      }),
      handleCheckbox: withContentStatus((contentStatus) => {
        return fn.addStrToSelectionTop(contentStatus, '- [ ] ')
      }),
      handleCode: withContentStatus((contentStatus) => {
        return fn.code(contentStatus)
      }),
      handleHorizon: withContentStatus((contentStatus) => {
        return fn.backspace(
          fn.addWord(fn.wrapSelection(contentStatus, '\n\n'), '---')
        )
      }),
      handleBackspace: withContentStatus((contentStatus) => {
        return fn.backspace(contentStatus)
      }),
      handleEnter: withContentStatus((contentStatus) => {
        return fn.enter(contentStatus)
      }),
      handleArrow: withContentStatusWithOptions<fn.ArrowDirection>(
        (contentStatus, direction: fn.ArrowDirection) => {
          return fn.arrow(contentStatus, direction)
        }
      ),
      handleClearSelectLines: withContentStatus((contentStatus) => {
        return fn.clearSelection(contentStatus)
      }),
      handleChangeSelectLines:
        withContentStatusWithOptions<ChangeSelectLinesOptions>(
          (contentStatus, options) => {
            return fn.changeSelectLines(contentStatus, options)
          }
        ),
      handleAddWord: withContentStatusWithOptions<string>(
        (contentStatus, word) => {
          return fn.addWord(contentStatus, word)
        }
      ),
    }
  }, [])

  return {
    handlerStatusRef,
    handlers,
  }
}

export type Handlers = ReturnType<typeof useCoreHandlers>['handlers']

export default useCoreHandlers
