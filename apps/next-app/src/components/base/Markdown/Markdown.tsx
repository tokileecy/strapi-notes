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
import { EditorEvent } from './useEditorEventManager'
import { LineState } from './useMarkdown'

export type MarkdownProps = {
  type?: 'editor' | 'preview' | 'both'
  content?: string
  contentLineIds?: string[]
  contentLineById?: Record<string, LineState>
  editorDivRefCallback?: (element: HTMLDivElement) => void
  textareaRefCallback?: (element: HTMLTextAreaElement) => void
  cursorRefCallback?: (element: HTMLDivElement) => void
  onChange?: (next: string) => void
  pushEvent?: (event: EditorEvent) => void
  refreshPreview?: () => void
  saveState?: () => void
  undoEdit?: () => void
  id?: string
  updateAt?: string
}

const Markdown = (props: MarkdownProps): JSX.Element => {
  const {
    content = '',
    type = 'preview',
    editorDivRefCallback,
    textareaRefCallback,

    cursorRefCallback,
    pushEvent,
    contentLineIds = [],
    contentLineById = {},
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
        <ToolbarIconButton
          component={BoldSvg}
          onClick={() => {
            pushEvent?.({
              type: 'commend',
              commend: 'bold',
            })
          }}
        />
        <ToolbarIconButton
          component={ItalicSvg}
          onClick={() => {
            pushEvent?.({
              type: 'commend',
              commend: 'italic',
            })
          }}
        />
        <ToolbarIconButton
          component={StrikeSvg}
          onClick={() => {
            pushEvent?.({
              type: 'commend',
              commend: 'strike',
            })
          }}
        />
        <ToolbarIconButton
          component={HeaderSvg}
          onClick={() => {
            pushEvent?.({
              type: 'commend',
              commend: 'header',
            })
          }}
        />
        <ToolbarIconButton
          component={CodeSvg}
          onClick={() => {
            pushEvent?.({
              type: 'commend',
              commend: 'code',
            })
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
                border: '1px solid white',
                p: 2,
                overflow: 'auto',
              }}
            >
              <Editor
                textareaRefCallback={textareaRefCallback}
                cursorRefCallback={cursorRefCallback}
                editorDivRefCallback={editorDivRefCallback}
                contentLineIds={contentLineIds}
                contentLineById={contentLineById}
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
