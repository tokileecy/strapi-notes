import React, { ChangeEventHandler } from 'react'
import Box from '@mui/material/Box'
import { LineState } from './useMarkdown'
import Cursor from './Cursor'

export type EditorProps = {
  textareaRefCallback?: (element: HTMLTextAreaElement) => void
  editorDivRefCallback?: (element: HTMLDivElement) => void
  cursorRefCallback?: (element: HTMLDivElement) => void
  contentLineIds: string[]
  contentLineById: Record<string, LineState>
  textareaValue?: string
  onTextareaChange?: ChangeEventHandler<HTMLTextAreaElement>
}

const Editor = (props: EditorProps): JSX.Element => {
  const {
    textareaRefCallback,
    cursorRefCallback,
    editorDivRefCallback,
    contentLineIds,
    contentLineById,
    textareaValue,
    onTextareaChange,
  } = props

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
          {contentLineIds.map((id) => {
            const line = contentLineById[id]

            let startText = ''
            let centerText = ''
            let endText = ''

            if (line.text !== '') {
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
            } else {
              centerText = '\u200b'
            }

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
                    // color: 'red',
                    // background: 'transparent',
                    background: '#191919',
                  },
                  'pre, span': {
                    wordVreak: 'break-all',
                    whiteSpace: 'break-spaces',
                  },
                }}
              >
                <Box
                  component="pre"
                  data-type="line"
                  data-start={line.start ?? ''}
                  data-end={line.end ?? ''}
                  sx={{
                    'm': 0,
                    'background':
                      line.start === undefined &&
                      line.end === undefined &&
                      startText === '' &&
                      endText === ''
                        ? '#191919'
                        : 'transparent',
                    'borderTop': '1px solid',
                    'borderBottom': '1px solid',
                    'borderColor':
                      line.start === undefined &&
                      line.end === undefined &&
                      startText === '' &&
                      endText === ''
                        ? '#191919'
                        : 'transparent',
                  }}
                >
                  <span data-type="line-start">{startText}</span>
                  {line.input && (
                    <span data-type="line-input">{textareaValue}</span>
                  )}
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

                  <span data-type="line-end">{endText}</span>
                </Box>
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
