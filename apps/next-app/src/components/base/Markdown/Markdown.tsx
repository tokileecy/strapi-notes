import { ChangeEventHandler } from 'react'
import Box from '@mui/material/Box'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Editor from './Editor'
import BoldSvg from './images/bold.svg'
import ItalicSvg from './images/italic.svg'
import StrikeSvg from './images/strike.svg'
import HeaderSvg from './images/header.svg'
import CodeSvg from './images/code.svg'
import ToolbarIconButton from './ToolbarIconButton'
import { ContentStatus, initialContentStatus } from './hooks/useContentStatus'
import { EditorCommendEvent } from './hooks/useCommendHandler'

export type MarkdownProps = {
  type?: 'editor' | 'preview' | 'both'
  content?: string
  contentStatus?: ContentStatus
  lineContainerRefCallback?: (element: HTMLDivElement) => void
  textareaRefCallback?: (element: HTMLTextAreaElement) => void
  cursorRefCallback?: (element: HTMLDivElement) => void
  onChange?: (next: string) => void
  commend?: (event: EditorCommendEvent) => void
  refreshPreview?: () => void
  saveState?: () => void
  undoEdit?: () => void
  id?: string
  updateAt?: string
  onTextareaChange?: ChangeEventHandler<HTMLTextAreaElement>
}

const Markdown = (props: MarkdownProps): JSX.Element => {
  const {
    content = '',
    type = 'preview',
    lineContainerRefCallback,
    textareaRefCallback,
    cursorRefCallback,
    commend: pushEvent,
    contentStatus = { ...initialContentStatus },
    onTextareaChange,
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
        data-type="tool-bar"
      >
        <ToolbarIconButton
          component={BoldSvg}
          onClick={() => {
            pushEvent?.('bold')
          }}
        />
        <ToolbarIconButton
          component={ItalicSvg}
          onClick={() => {
            pushEvent?.('italic')
          }}
        />
        <ToolbarIconButton
          component={StrikeSvg}
          onClick={() => {
            pushEvent?.('strike')
          }}
        />
        <ToolbarIconButton
          component={HeaderSvg}
          onClick={() => {
            pushEvent?.('header')
          }}
        />
        <ToolbarIconButton
          component={CodeSvg}
          onClick={() => {
            pushEvent?.('code')
          }}
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
              }}
            >
              <Editor
                textareaRefCallback={textareaRefCallback}
                cursorRefCallback={cursorRefCallback}
                lineContainerRefCallback={lineContainerRefCallback}
                contentStatus={contentStatus}
                onTextareaChange={onTextareaChange}
              />
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
