import Card, { CardProps } from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import { Post } from '@/types'
import Markdown from '@/components/base/Markdown'
import useMarkdown from '@/components/base/Markdown/hooks/useMarkdown'
import { useEffect } from 'react'
export interface PostCardProps {
  post: Post
  onClick?: CardProps['onClick']
}

const PostCard = (props: PostCardProps): JSX.Element => {
  const { post, onClick } = props

  const { content } = post

  const markdown = useMarkdown()
  const bannerProps: Record<string, string> = {}

  const targetContent = content?.replace(/<Banner.*\/>/g, (match) => {
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

  useEffect(() => {
    markdown.reset({ id: post.id, content: targetContent })
  }, [targetContent])

  return (
    <Card
      sx={[
        {
          height: '100%',
          overflow: 'auto',
          width: '900px',
          p: 0,
          m: 0,
          backgroundColor: 'transparent',
          boxShadow: 'none',
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
          'height': '100%',
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
            'height': '100%',
            'wordBreak': 'break-all',
          }}
        >
          {post.id && <Markdown type="both" {...markdown} />}
        </Box>
      </CardContent>
    </Card>
  )
}

export default PostCard
