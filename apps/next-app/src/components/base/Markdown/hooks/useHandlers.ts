import { Dispatch, MutableRefObject, useMemo, useRef } from 'react'
import * as fn from '../fn'
import { ChangeSelectLinesOptions } from '../fn/changeSelectLines'
import { ContentStatus, initialContentStatus } from './useContentStatus'
import { CursorStatus } from './useCursor'

interface Config {
  cursorNeedUpdate?: boolean
  handleFinished?: () => void
}

const defaultConfig: Config = {
  cursorNeedUpdate: true,
}

const useHandlers = (
  cursorStatusRef: MutableRefObject<CursorStatus>,
  contentStatus: ContentStatus,
  setContentStatus: Dispatch<Partial<ContentStatus>>
) => {
  const contentStatusRef = useRef<{
    contentStatus: ContentStatus
  }>({
    contentStatus: { ...initialContentStatus },
  })

  contentStatusRef.current.contentStatus = contentStatus

  return useMemo(() => {
    const commendCallbackQueue: (() => void)[] = []

    const withContentStatus = (
      func: (contentStatus: ContentStatus) => ContentStatus
    ): ((config?: Config) => void) => {
      return (config: Config = defaultConfig) => {
        const contentStatus = contentStatusRef.current.contentStatus

        setContentStatus?.(func(contentStatus))

        commendCallbackQueue.push(() => {
          if (config.cursorNeedUpdate) {
            cursorStatusRef.current.cursorNeedUpdate = true
          }

          config.handleFinished?.()
        })
      }
    }

    const withContentStatusWithOptions = <T>(
      func: (contentStatus: ContentStatus, option: T) => ContentStatus
    ): ((option: T, config?: Config) => void) => {
      return (option: T, config: Config = defaultConfig) => {
        const contentStatus = contentStatusRef.current.contentStatus

        setContentStatus?.(func(contentStatus, option))

        commendCallbackQueue.push(() => {
          if (config.cursorNeedUpdate) {
            cursorStatusRef.current.cursorNeedUpdate = true
          }

          config.handleFinished?.()
        })
      }
    }

    return {
      commendCallbackQueue,
      handleBold: withContentStatus((contentStatus) => {
        return fn.wrapSelection(contentStatus, '**')
      }),
      handleItalic: withContentStatus((contentStatus) => {
        return fn.wrapSelection(contentStatus, '*')
      }),
      handleStrike: withContentStatus((contentStatus) => {
        return fn.wrapSelection(contentStatus, '~~')
      }),
      handleHeader: withContentStatus((contentStatus) => {
        return fn.addHeshToTop(contentStatus)
      }),
      handleCode: withContentStatus((contentStatus) => {
        return fn.code(contentStatus)
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
}

export type Handlers = ReturnType<typeof useHandlers>

export default useHandlers
