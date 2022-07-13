import { MutableRefObject, useCallback } from 'react'

const wrapSelection = (element: HTMLTextAreaElement, str: string) => {
  const start = element.selectionStart
  const end = element.selectionEnd

  const startStr = element.value.slice(0, start)
  const centerStr = element.value.slice(start, end)

  const endStr = element.value.slice(end, element.value.length)

  const nextStr = `${startStr}${str}${centerStr}${str}${endStr}`

  element.value = nextStr
  element.selectionStart = start
  element.selectionEnd = end + str.length * 2
  element.focus()
}

const addHeshTopSelection = (element: HTMLTextAreaElement) => {
  const start = element.selectionStart
  const end = element.selectionEnd

  const startStr = element.value.slice(0, start)

  const endStr = element.value.slice(start, element.value.length)

  const splitStrs = startStr.split('\n')
  let nextStr = ''
  let centerStr = '#'
  let centerStrLength = 1

  if (splitStrs.length > 1) {
    const lastStr = splitStrs.pop()

    if (lastStr?.[0] !== '#') {
      centerStr += ' '
      centerStrLength++
    }

    nextStr = `${splitStrs.join('\n')}\n${centerStr}${lastStr}${endStr}`
  } else if (splitStrs.length === 1) {
    if (splitStrs[0][0] !== '#') {
      centerStr += ' '
      centerStrLength++
    }

    nextStr = `${centerStr}${splitStrs[0]}${endStr}`
  } else if (splitStrs.length === 0) {
    nextStr = `${centerStr}${endStr}`
  }

  element.value = nextStr
  element.selectionStart = start + centerStrLength
  element.selectionEnd = end + centerStrLength
  element.focus()
}

const useHandlers = (
  textareaRef: MutableRefObject<HTMLTextAreaElement | undefined>,
  saveState: () => void,
  refreshPreview: () => void
) => {
  const withSaveRefresh = useCallback(
    (func: () => void) => {
      return () => {
        saveState?.()
        func()
        refreshPreview?.()
      }
    },
    [refreshPreview, saveState]
  )

  const handleBold = useCallback(
    withSaveRefresh(() => {
      if (textareaRef.current) {
        wrapSelection(textareaRef.current, '**')
      }
    }),
    [textareaRef, withSaveRefresh]
  )

  const handleItalic = useCallback(
    withSaveRefresh(() => {
      if (textareaRef.current) {
        wrapSelection(textareaRef.current, '*')
      }
    }),
    [textareaRef, withSaveRefresh]
  )

  const handleStrike = useCallback(
    withSaveRefresh(() => {
      if (textareaRef.current) {
        wrapSelection(textareaRef.current, '~~')
      }
    }),
    [textareaRef, withSaveRefresh]
  )

  const handleHeader = useCallback(
    withSaveRefresh(() => {
      if (textareaRef.current) {
        addHeshTopSelection(textareaRef.current)
      }
    }),
    [textareaRef, withSaveRefresh]
  )

  return {
    handleBold,
    handleItalic,
    handleStrike,
    handleHeader,
  }
}

export type Handlers = ReturnType<typeof useHandlers>

export default useHandlers
