import {
  Dispatch,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { isSelectingWord } from '../fn/utils'
import { getLineElementsById } from '../utils'
import {
  ContentStatus,
  initialContentStatus,
  SetContentStatusAction,
} from './useContentStatus'
import { Handlers } from './useCoreHandlers'
import { HistoryHandlers } from './useHistoryHandlers'

const useTextareaHandlers = (
  textareaStatusRef: MutableRefObject<{
    isCompositionstart: boolean
  }>,
  textareaRef: MutableRefObject<HTMLTextAreaElement | undefined>,
  contentStatusRef: MutableRefObject<{
    contentStatus: ContentStatus
  }>,
  historyHandlers: HistoryHandlers,
  handlers: Handlers,
  setContentStatus: Dispatch<SetContentStatusAction>
) => {
  return useMemo(() => {
    const hanldeTextareaKeydown = (e: KeyboardEvent) => {
      const contentStatus = contentStatusRef.current.contentStatus

      if (e.key === 'Enter') {
        e.preventDefault()
      }

      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          historyHandlers.handleUndo()
        }
      } else {
        switch (e.key) {
          case 'Enter': {
            if (contentStatus.selectedRange.end === -1) {
              historyHandlers.saveState()

              handlers.handleEnter()
              e.preventDefault()
            } else {
              const inputLineId =
                contentStatus.ids[contentStatus.selectedRange.end]

              const inputText = contentStatus.lineById[inputLineId].inputText

              if (inputText.length === 0) {
                historyHandlers.saveState()
                handlers.handleEnter()
                e.preventDefault()
              }
            }

            break
          }

          case 'Backspace': {
            if (contentStatus.selectedRange.end === -1) {
              historyHandlers.saveState()
              handlers.handleBackspace()
              e.preventDefault()
            } else {
              const inputLineId =
                contentStatus.ids[contentStatus.selectedRange.end]

              const inputText = contentStatus.lineById[inputLineId].inputText

              if (inputText.length === 0) {
                historyHandlers.saveState()
                handlers.handleBackspace()
                e.preventDefault()
              }
            }

            break
          }

          case 'Escape':
            historyHandlers.saveState()

            if (!textareaStatusRef.current.isCompositionstart) {
              handlers.handleAddWord(textareaRef.current?.value ?? '', {
                handleFinished: () => {
                  textareaRef.current?.focus()
                  textareaStatusRef.current.isCompositionstart = false
                },
              })
            }

            break
          case 'Tab':
          case 'Meta':
          case 'Alt':
          case 'Control':
          case 'Shift':
            break

          case 'ArrowUp': {
            if (!textareaStatusRef.current.isCompositionstart) {
              const selectedLineId =
                contentStatus.ids[contentStatus.selectedRange.start]

              const selectedLine = contentStatus.lineById[selectedLineId]

              const { lineElement } = getLineElementsById(selectedLineId)

              if (isSelectingWord(contentStatus)) {
                handlers.handleChangeSelectLines({
                  selectedRange: {
                    start: contentStatus.selectedRange.start,
                    end: contentStatus.selectedRange.start,
                  },
                  line: {
                    start: selectedLine.start,
                    end: selectedLine.start,
                  },
                })
              } else if (lineElement && selectedLine.start !== 0) {
                const originRange = new Range()

                originRange.setStart(
                  lineElement.childNodes[0],
                  selectedLine.start
                )
                originRange.setEnd(
                  lineElement.childNodes[0],
                  selectedLine.start
                )

                const originRect = originRange.getBoundingClientRect()
                let notFound = true

                for (let i = selectedLine.start - 1; i >= 0; i--) {
                  const range = new Range()

                  range.setStart(lineElement.childNodes[0], i)
                  range.setEnd(lineElement.childNodes[0], i)

                  const rect = range.getBoundingClientRect()

                  if (
                    originRect.y > rect.y &&
                    Math.abs(originRect.x - rect.x) < 16
                  ) {
                    notFound = false

                    handlers.handleChangeSelectLines({
                      selectedRange: {
                        start: contentStatus.selectedRange.start,
                        end: contentStatus.selectedRange.start,
                      },
                      line: {
                        start: i,
                        end: i,
                      },
                    })
                    break
                  }
                }

                if (notFound) {
                  handlers.handleArrow('UP')
                }
              } else {
                handlers.handleArrow('UP')
              }
            }

            break
          }

          case 'ArrowDown': {
            if (!textareaStatusRef.current.isCompositionstart) {
              const selectedLineId =
                contentStatus.ids[contentStatus.selectedRange.start]

              const selectedLine = contentStatus.lineById[selectedLineId]

              const { lineElement } = getLineElementsById(selectedLineId)

              if (isSelectingWord(contentStatus)) {
                handlers.handleChangeSelectLines({
                  selectedRange: {
                    start: contentStatus.selectedRange.end,
                    end: contentStatus.selectedRange.end,
                  },
                  line: {
                    start: selectedLine.end,
                    end: selectedLine.end,
                  },
                })
              } else if (
                lineElement &&
                selectedLine.end !== selectedLine.text.length
              ) {
                const originRange = new Range()

                originRange.setStart(lineElement.childNodes[0], 0)
                originRange.setEnd(lineElement.childNodes[0], 0)

                const originRect = originRange.getBoundingClientRect()
                let notFound = true

                for (
                  let i = 1;
                  i < selectedLine.text.length - selectedLine.end;
                  i++
                ) {
                  const range = new Range()

                  range.setStart(lineElement.childNodes[0], i)
                  range.setEnd(lineElement.childNodes[0], i + 1)

                  const rect = range.getBoundingClientRect()

                  if (
                    originRect.y < rect.y &&
                    Math.abs(originRect.x - rect.x) < 16
                  ) {
                    notFound = false
                    handlers.handleChangeSelectLines({
                      selectedRange: {
                        start: contentStatus.selectedRange.end,
                        end: contentStatus.selectedRange.end,
                      },
                      line: {
                        start: selectedLine.end + i,
                        end: selectedLine.end + i,
                      },
                    })
                    break
                  }
                }

                if (notFound) {
                  handlers.handleArrow('DOWN')
                }
              } else {
                handlers.handleArrow('DOWN')
              }
            }

            break
          }

          case 'ArrowLeft':
            if (!textareaStatusRef.current.isCompositionstart) {
              handlers.handleArrow('LEFT')
            }

            break
          case 'ArrowRight':
            if (!textareaStatusRef.current.isCompositionstart) {
              handlers.handleArrow('RIGHT')
            }

            break
          case 'CapsLock':
            break
          case 'Space':
            break

          default: {
            break
          }
        }
      }
    }

    const handleTextareaChange = (e: Event) => {
      const element = e.target as HTMLTextAreaElement
      const value = element.value

      const contentStatus = contentStatusRef.current.contentStatus
      const inputLineId = contentStatus.ids[contentStatus.selectedRange.end]

      const nextLineById = {
        ...contentStatus.lineById,
      }

      nextLineById[inputLineId] = {
        ...nextLineById[inputLineId],
        inputText: value,
      }

      if (!textareaStatusRef.current.isCompositionstart) {
        handlers.handleAddWord(value, {
          handleFinished: () => {
            textareaRef.current?.focus()
            textareaStatusRef.current.isCompositionstart = false
          },
        })
      } else {
        setContentStatus({
          actionHistory: ['input'],
          lineById: nextLineById,
        })
      }
    }

    const handleCompositionstart = () => {
      textareaStatusRef.current.isCompositionstart = true
    }

    const handleCompositionupdate = () => {
      // handlerStatusRef.current.noticeCursorNeedUpdate()
    }

    const handleCompositionend = (e: CompositionEvent) => {
      const value = e.data

      if (textareaStatusRef.current.isCompositionstart) {
        handlers.handleAddWord(value, {
          handleFinished: () => {
            textareaRef.current?.focus()
            textareaStatusRef.current.isCompositionstart = false
          },
        })
      }
    }

    return {
      hanldeTextareaKeydown,
      handleTextareaChange,
      handleCompositionstart,
      handleCompositionupdate,
      handleCompositionend,
    }
  }, [historyHandlers, handlers])
}

const useTextarea = (
  contentStatus: ContentStatus,
  handlers: Handlers,
  historyHandlers: HistoryHandlers,
  setContentStatus: Dispatch<SetContentStatusAction>
) => {
  const textareaStatusRef = useRef<{ isCompositionstart: boolean }>({
    isCompositionstart: false,
  })

  const textareaRef = useRef<HTMLTextAreaElement>()

  const contentStatusRef = useRef<{
    contentStatus: ContentStatus
  }>({
    contentStatus: { ...initialContentStatus },
  })

  if (contentStatusRef.current) {
    contentStatusRef.current.contentStatus = contentStatus
  }

  const {
    hanldeTextareaKeydown,
    handleTextareaChange,
    handleCompositionstart,
    handleCompositionupdate,
    handleCompositionend,
  } = useTextareaHandlers(
    textareaStatusRef,
    textareaRef,
    contentStatusRef,
    historyHandlers,
    handlers,
    setContentStatus
  )

  const textareaRefCallback = useCallback((element: HTMLTextAreaElement) => {
    if (textareaRef.current !== element) {
      textareaRef.current?.removeEventListener('input', handleTextareaChange)
      textareaRef.current?.removeEventListener('keydown', hanldeTextareaKeydown)
      textareaRef.current?.removeEventListener(
        'compositionstart',
        handleCompositionstart
      )

      textareaRef.current?.removeEventListener(
        'compositionupdate',
        handleCompositionupdate
      )
      textareaRef.current?.removeEventListener(
        'compositionend',
        handleCompositionend
      )
      textareaRef.current = element
      textareaRef.current?.addEventListener('input', handleTextareaChange)
      textareaRef.current?.addEventListener(
        'compositionstart',
        handleCompositionstart
      )
      textareaRef.current?.addEventListener(
        'compositionupdate',
        handleCompositionupdate
      )
      textareaRef.current?.addEventListener(
        'compositionend',
        handleCompositionend
      )
      textareaRef.current?.addEventListener('keydown', hanldeTextareaKeydown)
    }
  }, [])

  useEffect(() => {
    if (textareaRef.current) {
      let inputText = ''

      if (contentStatus.selectedRange.end !== -1) {
        const lineById = contentStatus.lineById
        const lineId = contentStatus.ids[contentStatus.selectedRange.end]
        const line = lineById[lineId]

        if (line) {
          inputText = line.inputText
        }
      }

      textareaRef.current.value = inputText
    }
  }, [contentStatus])

  const focus = useCallback(() => {
    textareaRef.current?.focus()
  }, [])

  return {
    textareaRef,
    textareaStatusRef,
    textareaRefCallback,
    focus,
  }
}

export default useTextarea
