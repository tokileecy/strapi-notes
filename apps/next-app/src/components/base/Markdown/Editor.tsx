import React, { useContext, useMemo, useRef } from 'react'
import Box from '@mui/material/Box'
import Cursor from './Cursor'
import Line from './Line'
import EndLine from './EndLine'
import SelectArea from './SelectArea'
import { MarkdownContext } from './MarkdownProvider'

const Editor = (): JSX.Element => {
  const { lineContainerRefCallback, contentStatus } =
    useContext(MarkdownContext)

  const ref = useRef<HTMLDivElement>()

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
        <Cursor containerRef={ref} />
        <SelectArea containerRef={ref} />
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
