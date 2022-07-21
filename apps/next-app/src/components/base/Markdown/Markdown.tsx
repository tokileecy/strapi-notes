import Box from '@mui/material/Box'
import Editor from './Editor'
import Toolbar from './Toolbar'
import MarkdownProvider from './MarkdownProvider'
import Preview from './Preview'
import { MarkdownStatus } from './hooks/useMarkdown'

export type MarkdownProps = {
  type?: 'editor' | 'preview' | 'both'
  markdownStatus: MarkdownStatus
}

const Markdown = (props: MarkdownProps): JSX.Element => {
  const { type = 'preview', markdownStatus } = props

  return (
    <MarkdownProvider value={markdownStatus}>
      <Box
        sx={{
          'display': 'flex',
          'flexDirection': 'column',
          'gap': 2,
          'height': '100%',
        }}
      >
        {(type === 'editor' || type === 'both') && <Toolbar />}
        <Box sx={{ 'position': 'relative', 'flexGrow': 1 }}>
          <Box
            sx={{
              'position': 'absolute',
              'display': 'flex',
              'gap': 2,
              'width': '100%',
              'height': '100%',
            }}
          >
            {(type === 'editor' || type === 'both') && (
              <Box
                sx={{
                  'color': 'white',
                  'flexGrow': 1,
                  'flexBasis': 0,
                }}
              >
                <Editor />
              </Box>
            )}
            {(type === 'preview' || type === 'both') && (
              <Box
                sx={{
                  'color': 'white',
                  'flexGrow': 1,
                  'flexBasis': 0,
                  'border': '1px solid white',
                  'p': 2,
                  'overflow': 'auto',
                }}
              >
                <Preview />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </MarkdownProvider>
  )
}

export default Markdown
