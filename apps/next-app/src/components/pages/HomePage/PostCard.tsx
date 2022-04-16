import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import { Post } from '@/redux/features/posts/postSlice'
import Markdown from '@/components/base/Markdown'
export interface VideoCardProps {
  post: Post
}

const limitContentLength = 110

const VideoCard = (props: VideoCardProps): JSX.Element => {
  const { post } = props

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

  const ellipsisContent =
    targetContent && targetContent.length > limitContentLength
      ? (targetContent?.slice(0, limitContentLength - 10) ?? '') + '...'
      : targetContent

  return (
    <Card
      sx={{
        width: '90%',
        boxShadow: 'rgb(200 255 230 / 10%) 0px 0px 20px 10px',
      }}
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
            maxHeight: '400px',
            wordBreak: 'break-all',
          }}
        >
          <Markdown>{ellipsisContent}</Markdown>
        </Box>
      </CardContent>
    </Card>
  )
}

export default VideoCard
