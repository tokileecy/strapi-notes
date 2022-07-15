import React, { ChangeEventHandler, useEffect, useMemo } from 'react'
import Box from '@mui/material/Box'
import { ContentStatus } from './useMarkdown'
import Cursor from './Cursor'
import Line from './Line'

export type EditorProps = {
  textareaRefCallback?: (element: HTMLTextAreaElement) => void
  editorDivRefCallback?: (element: HTMLDivElement) => void
  cursorRefCallback?: (element: HTMLDivElement) => void
  contentStatus: ContentStatus
  textareaValue?: string
  onTextareaChange?: ChangeEventHandler<HTMLTextAreaElement>
}

const Editor = (props: EditorProps): JSX.Element => {
  const {
    textareaRefCallback,
    cursorRefCallback,
    editorDivRefCallback,
    textareaValue,
    contentStatus,
    onTextareaChange,
  } = props

  const lines = useMemo(() => {
    return contentStatus.ids.map((id) => {
      const line = contentStatus.lineById[id]

      return <Line key={id} id={id} lineState={line} />
    })
  }, [contentStatus.ids, contentStatus.lineById])

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
