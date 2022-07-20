import React, { useMemo, useRef } from 'react'
import Box from '@mui/material/Box'
import Cursor from './Cursor'
import Line from './Line'
import EndLine from './EndLine'
import { ContentStatus } from './hooks/useContentStatus'
import SelectArea from './SelectArea'

export type EditorProps = {
  textareaRefCallback?: (element: HTMLTextAreaElement) => void
  selectAreaRefCallback?: (element: HTMLDivElement) => void
  lineContainerRefCallback?: (element: HTMLDivElement) => void
  cursorRefCallback?: (element: HTMLDivElement) => void
  contentStatus: ContentStatus
}

const Editor = (props: EditorProps): JSX.Element => {
  const {
    textareaRefCallback,
    selectAreaRefCallback,
    lineContainerRefCallback,
    contentStatus,
  } = props

  const ref = useRef<HTMLDivElement>(document.createElement('div'))

  const lines = useMemo(() => {
    return contentStatus.ids.map((id) => {
      const line = contentStatus.lineById[id]

      return <Line key={id} id={id} lineState={line} />
    })
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
        ref={ref}
        sx={{
          outline: 'none',
          position: 'relative',
        }}
      >
        <Cursor
          contentStatus={contentStatus}
          containerRef={ref}
          textareaRefCallback={textareaRefCallback}
        />
        <SelectArea
          containerRef={ref}
          contentStatus={contentStatus}
          selectAreaRefCallback={selectAreaRefCallback}
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
