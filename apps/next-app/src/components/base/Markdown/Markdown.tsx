import Box from '@mui/material/Box'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Editor from './Editor'
import BoldSvg from './images/bold.svg'
import ToolbarIconButton from './ToolbarIconButton'

export type MarkdownProps = {
  type?: 'editor' | 'preview' | 'both'
  content?: string
  divRefCallback?: (element: HTMLDivElement) => void
  onChange?: (next: string) => void
  refreshPreview?: () => void
  saveState?: () => void
  undoEdit?: () => void
  handlers: {
    handleBold?: () => void
  }
  id?: string
  updateAt?: string
}

const Markdown = (props: MarkdownProps): JSX.Element => {
  const { content = '', type = 'preview', divRefCallback, handlers } = props

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          border: '1px solid white',
          p: 1,
        }}
      >
        <ToolbarIconButton component={BoldSvg} onClick={handlers.handleBold} />
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {(type === 'editor' || type === 'both') && (
          <Box
            sx={{
              flexGrow: 1,
              flexBasis: 0,
              border: '1px solid white',
              p: 2,
            }}
          >
            <Editor
              // onChange={handleContextChange}
              divRefCallback={divRefCallback}
            >
              {/* {context} */}
            </Editor>
          </Box>
        )}
        {(type === 'preview' || type === 'both') && (
          <Box
            sx={{
              flexGrow: 1,
              flexBasis: 0,
              border: '1px solid white',
              p: 2,
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Markdown
