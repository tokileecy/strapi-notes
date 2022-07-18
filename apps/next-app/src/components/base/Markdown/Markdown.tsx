import { ChangeEventHandler } from 'react'
import Box from '@mui/material/Box'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import Editor from './Editor'
import BoldSvg from './images/bold.svg'
import ItalicSvg from './images/italic.svg'
import StrikeSvg from './images/strike.svg'
import HeaderSvg from './images/header.svg'
import CodeSvg from './images/code.svg'
import HTMLSvg from './images/html.svg'
import QuoteSvg from './images/quote.svg'
import ListBulletSvg from './images/list-bullet.svg'
import ListNumberSvg from './images/list-number.svg'
import CheckboxSvg from './images/checkbox.svg'
import HorizonSvg from './images/horizon.svg'
import ToolbarIconButton from './ToolbarIconButton'
import { ContentStatus, initialContentStatus } from './hooks/useContentStatus'
import { EditorCommendEvent } from './hooks/useCommendHandler'
import { MarkdownContentDetail } from './hooks/useMarkdown'
import { Divider } from '@mui/material'

export type MarkdownProps = {
  type?: 'editor' | 'preview' | 'both'
  markdownContentDetails?: MarkdownContentDetail[]
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
    markdownContentDetails = [],
    type = 'preview',
    lineContainerRefCallback,
    textareaRefCallback,
    cursorRefCallback,
    commend: pushEvent,
    contentStatus = { ...initialContentStatus },
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
          component={QuoteSvg}
          onClick={() => {
            pushEvent?.('quote')
          }}
        />
        <ToolbarIconButton
          component={ListBulletSvg}
          onClick={() => {
            pushEvent?.('list-bullet')
          }}
        />
        <ToolbarIconButton
          component={ListNumberSvg}
          onClick={() => {
            pushEvent?.('list-number')
          }}
        />
        <ToolbarIconButton
          component={CodeSvg}
          onClick={() => {
            pushEvent?.('code')
          }}
        />
        <ToolbarIconButton
          component={HorizonSvg}
          onClick={() => {
            pushEvent?.('horizon')
          }}
        />
        <ToolbarIconButton
          component={CheckboxSvg}
          onClick={() => {
            pushEvent?.('checkbox')
          }}
        />
        <Divider
          sx={{ borderColor: 'white' }}
          orientation="vertical"
          flexItem
        />
        <ToolbarIconButton
          component={HTMLSvg}
          onClick={() => {
            pushEvent?.('html')
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
              {markdownContentDetails.map((markdownContentDetail, index) => {
                const rehypePlugins = []

                if (markdownContentDetail.enableHtml) {
                  rehypePlugins.push(rehypeRaw)
                }

                return (
                  <ReactMarkdown
                    key={index}
                    rehypePlugins={rehypePlugins}
                    remarkPlugins={[remarkGfm]}
                  >
                    {markdownContentDetail.text}
                  </ReactMarkdown>
                )
              })}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default Markdown
