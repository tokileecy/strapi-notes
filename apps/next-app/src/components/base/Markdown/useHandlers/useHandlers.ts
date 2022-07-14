import { useMemo } from 'react'
import { EditorCoreRef } from '../useMarkdown'
import useHandleBackspace from './useHandleBackspace'
import useHandleDefault from './useHandleDefault'
import useHandleEnter from './useHandleEnter'
import useHandleWrapSelection from './useHandleWrapSelection'
import useAddHeshToSelectionTop from './useAddHeshToSelectionTop'
import useHandleCode from './useHandleCode'

const useHandlers = (editorCoreRef: EditorCoreRef) => {
  const handleBackspace = useHandleBackspace(editorCoreRef)
  const handleDefault = useHandleDefault(editorCoreRef)
  const handleEnter = useHandleEnter(editorCoreRef)
  const handleBold = useHandleWrapSelection(editorCoreRef, '**')
  const handleItalic = useHandleWrapSelection(editorCoreRef, '*')
  const handleStrike = useHandleWrapSelection(editorCoreRef, '~~')
  const handleHeader = useAddHeshToSelectionTop(editorCoreRef)
  const handleCode = useHandleCode(editorCoreRef)

  return useMemo(() => {
    return {
      handleBold,
      handleItalic,
      handleStrike,
      handleHeader,
      handleCode,
      handleDefault,
      handleBackspace,
      handleEnter,
    }
  }, [editorCoreRef])
}

export type Handlers = ReturnType<typeof useHandlers>

export default useHandlers
