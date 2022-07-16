import React, { useMemo } from 'react'
import Box from '@mui/material/Box'
import { LineState } from './useMarkdown'

export interface LineProps {
  id: string
  lineState: LineState
}

const Line = (props: LineProps) => {
  const { id, lineState } = props

  const { lineCenter, lineEnd, lineStart, lineInput, selectAll } =
    useMemo(() => {
      let startText = ''
      let centerText = ''
      let endText = ''

      if (lineState.text !== '') {
        if (lineState.start === undefined && lineState.end === undefined) {
          centerText = lineState.text
        } else if (lineState.start === undefined) {
          centerText = lineState.text.slice(0, lineState.end)
          endText = lineState.text.slice(lineState.end, lineState.text.length)
        } else if (lineState.end === undefined) {
          startText = lineState.text.slice(0, lineState.start)
          centerText = lineState.text.slice(
            lineState.start,
            lineState.text.length
          )
        } else {
          startText = lineState.text.slice(0, lineState.start)
          centerText = lineState.text.slice(lineState.start, lineState.end)
          endText = lineState.text.slice(lineState.end, lineState.text.length)
        }
      } else {
        centerText = '\u200b'
      }

      const lineStart = <span data-type="line-start">{startText}</span>

      const lineCenter = (
        <span
          data-type="line-center"
          style={{
            'background': '#191919',
            'borderTop': '1px solid',
            'borderBottom': '1px solid',
            'borderColor': '#191919',
          }}
        >
          {centerText}
        </span>
      )

      const lineInput = (
        <span data-type="line-input">{lineState.inputText}</span>
      )

      const lineEnd = <span data-type="line-end">{endText}</span>

      return {
        selectAll: startText === '' && endText === '',
        lineStart,
        lineCenter,
        lineInput,
        lineEnd,
      }
    }, [lineState])

  return (
    <Box
      key={id}
      data-id={id}
      data-type="wrapper"
      sx={{
        'lineHeight': '1.5em',
        '&:first-of-type': {
          mt: 0,
        },
        '& ::selection': {
          background: '#191919',
        },
        'pre, span': {
          whiteSpace: 'break-spaces',
        },
      }}
    >
      <Box
        component="pre"
        data-type="line"
        data-start={lineState.start ?? ''}
        data-end={lineState.end ?? ''}
        sx={{
          'm': 0,
          'background':
            lineState.start === undefined &&
            lineState.end === undefined &&
            selectAll
              ? '#191919'
              : 'transparent',
          'borderTop': '1px solid',
          'borderBottom': '1px solid',
          'borderColor':
            lineState.start === undefined &&
            lineState.end === undefined &&
            selectAll
              ? '#191919'
              : 'transparent',
        }}
      >
        {lineStart}
        {lineInput}
        {lineCenter}
        {lineEnd}
      </Box>
    </Box>
  )
}

export default Line
