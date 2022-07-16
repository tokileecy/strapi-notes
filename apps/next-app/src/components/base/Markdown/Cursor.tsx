import Box from '@mui/material/Box'
import { ChangeEventHandler } from 'react'

export interface CursorProps {
  cursorRefCallback?: (element: HTMLDivElement) => void
  textareaRefCallback?: (element: HTMLTextAreaElement) => void
  textareaValue?: string
  onTextareaChange?: ChangeEventHandler<HTMLTextAreaElement>
}

const Cursor = (props: CursorProps) => {
  const {
    cursorRefCallback,
    textareaRefCallback,
    textareaValue = '',
    onTextareaChange,
  } = props

  return (
    <Box
      ref={cursorRefCallback}
      sx={{
        'position': 'absolute',
        'width': '2px',
        'userSelect': 'none',
        'outline': 'none',
      }}
    >
      <Box
        sx={{
          '@keyframes shrink': {
            'from': {
              opacity: 1,
            },
            '0.01%': {
              opacity: 0,
            },
            '50%': { opacity: 0 },
            '50.99%': { opacity: 1 },
            'to': {
              opacity: 1,
            },
          },
          'position': 'relative',
          'backgroundColor': '#efefef',
          'width': '2px',
          '&:empty': {
            height: '1.25em',
          },
          'animation': 'shrink 1.5s infinite ease',
          'userSelect': 'none',
          'pointerEvents': 'none',
          'outline': 'none',
        }}
      ></Box>
      <Box
        ref={textareaRefCallback}
        sx={{
          userSelect: 'none',
          outline: 'none',
          width: '0',
          pointerEvents: 'none',
          p: 0,
          border: 'none',
        }}
        component="textarea"
        value={textareaValue}
        onChange={onTextareaChange}
      ></Box>
    </Box>
  )
}

export default Cursor
