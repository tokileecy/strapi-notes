import Box from '@mui/material/Box'
import { MutableRefObject, useEffect } from 'react'
import { ContentStatus } from './hooks/useContentStatus'
import useElementCallback from './hooks/useElementCallback'
import { getLineElementsById, refreshCursorBySelection } from './utils'

export interface CursorProps {
  containerRef: MutableRefObject<HTMLDivElement>
  textareaRefCallback?: (element: HTMLTextAreaElement) => void
  contentStatus: ContentStatus
}

const Cursor = (props: CursorProps) => {
  const { containerRef, contentStatus, textareaRefCallback } = props

  const [cursorRef, cursorRefCallback] = useElementCallback<HTMLDivElement>()
  // const range = useMemo(() => {}, [contentStatus])

  useEffect(() => {
    const range = new Range()
    const lineId = contentStatus.ids[contentStatus.selectedRange.end]
    const line = contentStatus.lineById[lineId]
    const lineElements = getLineElementsById(lineId)

    if (lineElements.lineElement && cursorRef.current) {
      const textNode = lineElements.lineElement.childNodes[0]

      range.setStart(textNode, line.end)
      range.setEnd(textNode, line.end)

      refreshCursorBySelection(containerRef.current, cursorRef.current, range)
    }
  }, [contentStatus])

  return (
    <Box
      ref={cursorRefCallback}
      sx={{
        'position': 'absolute',
        'width': '2px',
        'pointerEvents': 'none',
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
        defaultValue=""
      ></Box>
    </Box>
  )
}

export default Cursor
