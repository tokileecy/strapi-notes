import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { MarkdownContext } from './MarkdownProvider'
import { useContext } from 'react'

const Preview = () => {
  const { markdownContentDetails } = useContext(MarkdownContext)

  return (
    <>
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
    </>
  )
}

export default Preview
