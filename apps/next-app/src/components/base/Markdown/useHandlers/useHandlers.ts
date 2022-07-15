import { useMemo } from 'react'
import { EditorCoreRef } from '../useMarkdown'
import useHandleBackspace from './useHandleBackspace'
import useHandleEnter from './useHandleEnter'
import useHandleWrapSelection from './useHandleWrapSelection'
import useAddHeshToSelectionTop from './useAddHeshToSelectionTop'
import useHandleCode from './useHandleCode'
import useHandleArrow from './useHandleArrow'

const useHandlers = (editorCoreRef: EditorCoreRef) => {
  const handleBackspace = useHandleBackspace(editorCoreRef)
  const handleEnter = useHandleEnter(editorCoreRef)
  const handleBold = useHandleWrapSelection(editorCoreRef, '**')
  const handleItalic = useHandleWrapSelection(editorCoreRef, '*')
  const handleStrike = useHandleWrapSelection(editorCoreRef, '~~')
  const handleHeader = useAddHeshToSelectionTop(editorCoreRef)
  const handleCode = useHandleCode(editorCoreRef)
  const handleArrow = useHandleArrow(editorCoreRef)

  return useMemo(() => {
    return {
      handleBold,
      handleItalic,
      handleStrike,
      handleHeader,
      handleCode,
      handleBackspace,
      handleEnter,
      handleArrow,
    }
  }, [editorCoreRef])
}

export type Handlers = ReturnType<typeof useHandlers>

export default useHandlers
