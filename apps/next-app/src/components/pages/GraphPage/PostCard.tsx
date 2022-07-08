import Card, { CardProps } from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import { Post } from '@/redux/features/posts/postSlice'
import Markdown from '@/components/base/Markdown'
export interface PostCardProps {
  post: Post
  onClick?: CardProps['onClick']
}

const PostCard = (props: PostCardProps): JSX.Element => {
  const { post, onClick } = props

  const { content } = post

  const bannerProps: Record<string, string> = {}

  const targetContent = content.replace(/<Banner.*\/>/g, (match) => {
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
  })

  // const ellipsisContent =
  //   targetContent && targetContent.length > limitContentLength
  //     ? (targetContent?.slice(0, limitContentLength - 10) ?? '') + '...'
  //     : targetContent

  return (
    <Card
      sx={[
        {
          maxHeight: '100%',
          overflow: 'auto',
          width: '500px',
          p: 0,
          m: 0,
          backgroundColor: 'rgba(15, 108, 176, 0.24)',
          color: 'white',
        },
      ]}
      onClick={onClick}
    >
      {bannerProps.src && (
        <CardMedia component="img" height="130" image={bannerProps.src} />
      )}

      <CardContent
        sx={{
          'display': 'flex',
          'flexDirection': 'column',
          'pt': 2,
          'pb': 2,
          '&:last-child': {
            pt: 2,
            pb: 2,
          },
        }}
      >
        <Box
          sx={{
            wordBreak: 'break-all',
          }}
        >
          <Markdown>{targetContent}</Markdown>
        </Box>
      </CardContent>
    </Card>
  )
}

export default PostCard
