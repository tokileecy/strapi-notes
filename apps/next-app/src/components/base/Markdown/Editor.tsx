import React, { ChangeEventHandler, useMemo } from 'react'
import Box from '@mui/material/Box'
import Cursor from './Cursor'
import Line from './Line'
import EndLine from './EndLine'
import { ContentStatus } from './hooks/useContentStatus'

export type EditorProps = {
  textareaRefCallback?: (element: HTMLTextAreaElement) => void
  lineContainerRefCallback?: (element: HTMLDivElement) => void
  cursorRefCallback?: (element: HTMLDivElement) => void
  contentStatus: ContentStatus
  onTextareaChange?: ChangeEventHandler<HTMLTextAreaElement>
}

const Editor = (props: EditorProps): JSX.Element => {
  const {
    textareaRefCallback,
    cursorRefCallback,
    lineContainerRefCallback,
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
    <Box
      sx={{
        height: '100%',
        width: '100%',
        overflow: 'auto',
        border: '1px solid white',
        p: 2,
      }}
      data-type="editor"
    >
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
          ref={lineContainerRefCallback}
          sx={{
            outline: 'none',
            position: 'relative',
          }}
          data-type="line-container"
        >
          {lines}
          <EndLine />
        </Box>
      </Box>
    </Box>
  )
}

export default Editor
