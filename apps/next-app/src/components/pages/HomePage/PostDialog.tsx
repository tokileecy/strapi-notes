import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Box from '@mui/material/Box'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import { Post } from '@/types'

export interface PostDialogProps extends DialogProps {
  post: Post | null
}

const PostDialog = (inProps: PostDialogProps): JSX.Element => {
  const { post, ...props } = inProps

  let targetContent = ''

  if (post) {
    const { content } = post

    const bannerProps: Record<string, string> = {}

    targetContent =
      content?.replace(/<Banner.*\/>/g, (match) => {
        const banner = match

        banner
          .replace(/<Banner/, '')
          .replace(/\/>/, '')
          .split(/ /g)
          .forEach((str) => {
            const [key, value] = str.split(/=/g)

            if (key !== '' && value !== '') {
              bannerProps[key] = value.replace(/^"/, '').replace(/"$/, '')
            }
          })
        return ''
      }) ?? ''
  }

  return (
    <Dialog maxWidth="md" {...props}>
      <Box
        sx={{
          pt: 2,
          pb: 2,
          pl: 4,
          pr: 4,
          wordBreak: 'break-all',
        }}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {targetContent ?? ''}
        </ReactMarkdown>
      </Box>
    </Dialog>
  )
}

export default PostDialog
