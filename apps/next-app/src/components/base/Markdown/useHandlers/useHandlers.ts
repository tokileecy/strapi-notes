import { useMemo } from 'react'
import { ContentStatus, EditorCoreRef } from '../useMarkdown'
import * as fn from './fn'

const useHandlers = (editorCoreRef: EditorCoreRef) => {
  return useMemo(() => {
    const withContentStatus = (
      func: (contentStatus: ContentStatus) => ContentStatus
    ): (() => () => void) => {
      return () => {
        const contentStatus = editorCoreRef.current.contentStatus
        const setContentStatus = editorCoreRef.current.setContentStatus

        setContentStatus?.(func(contentStatus))

        return () => {
          editorCoreRef.current.cursorNeedUpdate = true
        }
      }
    }

    const withContentStatusWithOptions = <T>(
      func: (contentStatus: ContentStatus, option: T) => ContentStatus
    ): ((option: T) => () => void) => {
      return (option: T) => {
        const contentStatus = editorCoreRef.current.contentStatus
        const setContentStatus = editorCoreRef.current.setContentStatus

        setContentStatus?.(func(contentStatus, option))

        return () => {
          editorCoreRef.current.cursorNeedUpdate = true
        }
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
      handleHeader: withContentStatus((contentStatus) => {
        return fn.addHeshToTop(contentStatus)
      }),
      handleCode: withContentStatus((contentStatus) => {
        return fn.code(contentStatus, editorCoreRef)
      }),
      handleBackspace: withContentStatus((contentStatus) => {
        return fn.backspace(contentStatus, editorCoreRef)
      }),
      handleEnter: withContentStatus((contentStatus) => {
        return fn.enter(contentStatus, editorCoreRef)
      }),
      handleArrow: withContentStatusWithOptions<fn.ArrowDirection>(
        (contentStatus, direction: fn.ArrowDirection) => {
          return fn.arrow(contentStatus, editorCoreRef, direction)
        }
      ),
    }
  }, [editorCoreRef])
}

export type Handlers = ReturnType<typeof useHandlers>

export default useHandlers
