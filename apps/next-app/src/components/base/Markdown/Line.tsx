import React, { ReactNode, useMemo } from 'react'
import Box from '@mui/material/Box'
import { LineState } from './hooks/useContentStatus'

export interface LineProps {
  id: string
  lineState: LineState
}

const BaseLineContent = (props: {
  type: 'start' | 'center' | 'end' | 'input'
  children: ReactNode
}) => {
  const { type, children } = props

  return (
    <Box
      component="span"
      sx={{
        background:
          type === 'input'
            ? '#4e4e4e'
            : type === 'center'
            ? '#191919'
            : 'transparent',
        lineHeight: 'inherit',
      }}
      data-type={`line-${type}`}
    >
      {children}
    </Box>
  )
}

const Line = (props: LineProps) => {
  const { id, lineState } = props

  const { startText, centerText, endText, inputText, selectAll } =
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

      const lineStart = (
        <BaseLineContent type="start">{startText}</BaseLineContent>
      )

      const lineCenter = (
        <BaseLineContent type="center">{centerText}</BaseLineContent>
      )

      const lineInput = (
        <BaseLineContent type="input">{lineState.inputText}</BaseLineContent>
      )

      const lineEnd = <BaseLineContent type="end">{endText}</BaseLineContent>

      return {
        selectAll: startText === '' && endText === '',
        lineStart,
        lineCenter,
        lineInput,
        lineEnd,
        startText,
        centerText,
        endText,
        inputText: lineState.inputText,
      }
    }, [lineState])

  return (
    <Box
      data-type="line-wrapper"
      sx={{
        'lineHeight': '1.25',
        '&:first-of-type': {
          mt: 0,
        },
        '& ::selection': {
          background: '#191919',
        },
        'pre, span': {
          whiteSpace: 'break-spaces',
          border: 'none',
        },
      }}
    >
      <Box
        component="pre"
        data-type="line"
        key={id}
        data-id={id}
        data-start={lineState.start ?? ''}
        data-end={lineState.end ?? ''}
        sx={{
          'm': 0,
          'lineHeight': 'inherit',
          'background':
            lineState.start === undefined &&
            lineState.end === undefined &&
            selectAll
              ? '#191919'
              : 'transparent',
        }}
      >
        {`${startText}${centerText}${inputText}${endText}`}
      </Box>
    </Box>
  )
}

export default Line
