import React, { ChangeEventHandler, useMemo } from 'react'
import Box from '@mui/material/Box'
import { ContentStatus } from './hooks/useContentStatus'
import Cursor from './Cursor'
import Line from './Line'

export type EditorProps = {
  textareaRefCallback?: (element: HTMLTextAreaElement) => void
  editorDivRefCallback?: (element: HTMLDivElement) => void
  cursorRefCallback?: (element: HTMLDivElement) => void
  contentStatus: ContentStatus
  onTextareaChange?: ChangeEventHandler<HTMLTextAreaElement>
}

const Editor = (props: EditorProps): JSX.Element => {
  const {
    textareaRefCallback,
    cursorRefCallback,
    editorDivRefCallback,
    contentStatus,
    onTextareaChange,
  } = props

  const lines = useMemo(() => {
    return contentStatus.ids.map((id) => {
      const line = contentStatus.lineById[id]

      return <Line key={id} id={id} lineState={line} />
    })
  }, [contentStatus.ids, contentStatus.lineById])

  const textareaValue = useMemo(() => {
    let inputText = ''

    if (contentStatus.selectedRange.end !== -1) {
      const lineById = contentStatus.lineById
      const lineId = contentStatus.ids[contentStatus.selectedRange.end]

      inputText = lineById[lineId].inputText
    }

    return inputText
  }, [contentStatus])

  return (
    <>
      <Box
        sx={{
          outline: 'none',
          position: 'relative',
        }}
      >
        <Cursor
          cursorRefCallback={cursorRefCallback}
          textareaRefCallback={textareaRefCallback}
          textareaValue={textareaValue}
          onTextareaChange={onTextareaChange}
        />
        <Box
          ref={editorDivRefCallback}
          sx={{
            outline: 'none',
            position: 'relative',
          }}
          data-type="editor"
        >
          {lines}
          <Box
            sx={{
              height: 0,
              m: 0,
            }}
          >
            <Box
              component="pre"
              data-type="end"
              sx={{
                height: 0,
                m: 0,
              }}
            >
              &#8203;
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Editor
