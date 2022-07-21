import Box from '@mui/material/Box'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import Editor from './Editor'
import Toolbar from './Toolbar'
import { ContentStatus, initialContentStatus } from './hooks/useContentStatus'
import { EditorCommendEvent } from './hooks/useCommendHandler'
import { MarkdownContentDetail } from './hooks/useMarkdown'

export type MarkdownProps = {
  type?: 'editor' | 'preview' | 'both'
  markdownContentDetails?: MarkdownContentDetail[]
  contentStatus?: ContentStatus
  lineContainerRefCallback?: (element: HTMLDivElement) => void
  textareaRefCallback?: (element: HTMLTextAreaElement) => void
  cursorRefCallback?: (element: HTMLDivElement) => void
  commend?: (event: EditorCommendEvent) => void
}

const Markdown = (props: MarkdownProps): JSX.Element => {
  const {
    markdownContentDetails = [],
    type = 'preview',
    lineContainerRefCallback,
    textareaRefCallback,
    cursorRefCallback,
    commend,
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
      <Toolbar commend={commend} />
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
