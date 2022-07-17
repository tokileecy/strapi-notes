import { MutableRefObject, useMemo } from 'react'
import { ContentStatus, EditorCoreRef } from './useMarkdown'
import * as fn from '../fn'
import { ChangeSelectLinesOptions } from '../fn/changeSelectLines'

interface Config {
  cursorNeedUpdate?: boolean
  textureAreaFocus?: boolean
  finishedComposition?: boolean
}

const defaultConfig: Config = {
  cursorNeedUpdate: true,
}

const useHandlers = (
  editorCoreRef: EditorCoreRef,
  textareaRef: MutableRefObject<HTMLTextAreaElement | undefined>
) => {
  return useMemo(() => {
    const withContentStatus = (
      func: (contentStatus: ContentStatus) => ContentStatus
    ): ((config?: Config) => () => void) => {
      return (config: Config = defaultConfig) => {
        const contentStatus = editorCoreRef.current.contentStatus
        const setContentStatus = editorCoreRef.current.setContentStatus

        setContentStatus?.(func(contentStatus))

        return () => {
          if (config.cursorNeedUpdate) {
            editorCoreRef.current.cursorNeedUpdate = true
          }

          if (config.textureAreaFocus) {
            textareaRef.current?.focus()
          }

          if (config.finishedComposition) {
            editorCoreRef.current.isCompositionstart = false
          }
        }
      }
    }

    const withContentStatusWithOptions = <T>(
      func: (contentStatus: ContentStatus, option: T) => ContentStatus
    ): ((option: T, config?: Config) => () => void) => {
      return (option: T, config: Config = defaultConfig) => {
        const contentStatus = editorCoreRef.current.contentStatus
        const setContentStatus = editorCoreRef.current.setContentStatus

        setContentStatus?.(func(contentStatus, option))

        return () => {
          if (config.cursorNeedUpdate) {
            editorCoreRef.current.cursorNeedUpdate = true
          }

          if (config.textureAreaFocus) {
            textareaRef.current?.focus()
          }

          if (config.finishedComposition) {
            editorCoreRef.current.isCompositionstart = false
          }
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
  }, [editorCoreRef, textareaRef])
}

export type Handlers = ReturnType<typeof useHandlers>

export default useHandlers
