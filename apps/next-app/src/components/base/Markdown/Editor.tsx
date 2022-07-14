import Box from '@mui/material/Box'
import React from 'react'
import { LineState } from './useMarkdown'

export type EditorProps = {
  textareaRefCallback?: (element: HTMLTextAreaElement) => void
  editorDivRefCallback?: (element: HTMLDivElement) => void
  cursorRefCallback?: (element: HTMLDivElement) => void
  contentLineIds: string[]
  contentLineById: Record<string, LineState>
}

const Editor = (props: EditorProps): JSX.Element => {
  const {
    textareaRefCallback,
    cursorRefCallback,
    editorDivRefCallback,
    contentLineIds,
    contentLineById,
  } = props

  return (
    <>
      <Box>
        <Box
          ref={editorDivRefCallback}
          sx={{
            outline: 'none',
            position: 'relative',
          }}
        >
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
                'outline': 'none',
              }}
            ></Box>
            <Box
              sx={{
                userSelect: 'none',
                outline: 'none',
              }}
              component="textarea"
              ref={textareaRefCallback}
            ></Box>
          </Box>
          {contentLineIds.map((id) => {
            const line = contentLineById[id]

            let startText = ''
            let centerText = ''
            let endText = ''

            if (line.text !== '' && line.isSelected) {
              if (line.start === undefined && line.end === undefined) {
                centerText = line.text
              } else if (line.start === undefined) {
                centerText = line.text.slice(0, line.end)
                endText = line.text.slice(line.end, line.text.length)
              } else if (line.end === undefined) {
                startText = line.text.slice(0, line.start)
                centerText = line.text.slice(line.start, line.text.length)
              } else {
                startText = line.text.slice(0, line.start)
                centerText = line.text.slice(line.start, line.end)
                endText = line.text.slice(line.end, line.text.length)
              }
            } else if (line.text !== '') {
              startText = line.text
            }

            return (
              <Box
                key={id}
                data-id={id}
                data-type="wrapper"
                sx={{
                  'lineHeight': '1.25em',
                  '&:first-of-type': {
                    mt: 0,
                  },
                  '& ::selection': {
                    // color: 'red',
                    background: 'transparent',
                  },
                }}
              >
                {line.text === '' ? (
                  <Box
                    component="pre"
                    data-type="word"
                    sx={{
                      'm': 0,
                      'background': line.isSelected ? '#191919' : 'transparent',
                      'borderTop': '1px solid',
                      'borderBottom': '1px solid',
                      'borderColor': line.isSelected
                        ? '#191919'
                        : 'transparent',
                    }}
                  >
                    &#8203;
                  </Box>
                ) : (
                  <Box
                    component="pre"
                    data-type="word"
                    sx={{
                      'm': 0,
                      'background':
                        line.isSelected && startText === '' && endText === ''
                          ? '#191919'
                          : 'transparent',
                      'borderTop': '1px solid',
                      'borderBottom': '1px solid',
                      'borderColor':
                        line.isSelected && startText === '' && endText === ''
                          ? '#191919'
                          : 'transparent',
                    }}
                  >
                    <span>{startText}</span>
                    <span
                      style={{
                        'background': '#191919',
                        'borderTop': '1px solid',
                        'borderBottom': '1px solid',
                        'borderColor': '#191919',
                      }}
                    >
                      {centerText}
                    </span>
                    <span>{endText}</span>
                  </Box>
                )}
              </Box>
            )
          })}
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
