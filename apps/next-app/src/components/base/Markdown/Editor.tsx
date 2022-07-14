import Box from '@mui/material/Box'
import React from 'react'

export type EditorProps = {
  textareaRefCallback?: (element: HTMLDivElement) => void
  cursorRefCallback?: (element: HTMLDivElement) => void
  contentLineIds: string[]
  contentLineById: Record<string, string>
}

const Editor = (props: EditorProps): JSX.Element => {
  const {
    cursorRefCallback,
    textareaRefCallback,
    contentLineIds,
    contentLineById,
  } = props

  return (
    <>
      <Box>
        <Box
          ref={textareaRefCallback}
          sx={{
            outline: 'none',
            position: 'relative',
          }}
        >
          <Box
            ref={cursorRefCallback}
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
              'position': 'absolute',
              'backgroundColor': '#efefef',
              'width': '2px',
              'height': '100%',
              '&:empty': {
                height: '1.25em',
              },
              'animation': 'shrink 1.5s infinite ease',
            }}
          ></Box>
          {contentLineIds.map((id) => {
            const line = contentLineById[id]

            return (
              <Box
                key={id}
                data-id={id}
                data-type="wrapper"
                sx={{
                  'lineHeight': '1.25em',
                  'mt': '1.25em',
                  '&:first-of-type': {
                    mt: 0,
                  },
                }}
              >
                {line === '' ? (
                  <Box component="pre" data-type="word" sx={{ m: 0 }}>
                    &#8203;
                  </Box>
                ) : (
                  <Box component="pre" data-type="word" sx={{ m: 0 }}>
                    {line}
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
