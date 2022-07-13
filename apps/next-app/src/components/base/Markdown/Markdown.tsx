import Box from '@mui/material/Box'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Editor from './Editor'
import BoldSvg from './images/bold.svg'
import ItalicSvg from './images/italic.svg'
import StrikeSvg from './images/strike.svg'
import HeaderSvg from './images/header.svg'
import ToolbarIconButton from './ToolbarIconButton'
import { Handlers } from './useHandlers'

export type MarkdownProps = {
  type?: 'editor' | 'preview' | 'both'
  content?: string
  textareaRefCallback?: (element: HTMLTextAreaElement) => void
  onChange?: (next: string) => void
  refreshPreview?: () => void
  saveState?: () => void
  undoEdit?: () => void
  handlers?: Handlers
  id?: string
  updateAt?: string
}

const Markdown = (props: MarkdownProps): JSX.Element => {
  const {
    content = '',
    type = 'preview',
    textareaRefCallback,
    handlers,
  } = props

  return (
    <Box
      sx={{
        'display': 'flex',
        'flexDirection': 'column',
        'gap': 2,
        'height': '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          border: '1px solid white',
          p: 1,
        }}
      >
        <ToolbarIconButton component={BoldSvg} onClick={handlers?.handleBold} />
        <ToolbarIconButton
          component={ItalicSvg}
          onClick={handlers?.handleItalic}
        />
        <ToolbarIconButton
          component={StrikeSvg}
          onClick={handlers?.handleStrike}
        />
        <ToolbarIconButton
          component={HeaderSvg}
          onClick={handlers?.handleHeader}
        />
      </Box>
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
                flexGrow: 1,
                flexBasis: 0,
                border: '1px solid white',
                p: 2,
                overflow: 'auto',
              }}
            >
              <Editor textareaRefCallback={textareaRefCallback} />
            </Box>
          )}
          {(type === 'preview' || type === 'both') && (
            <Box
              sx={{
                flexGrow: 1,
                flexBasis: 0,
                border: '1px solid white',
                p: 2,
                overflow: 'auto',
              }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default Markdown
