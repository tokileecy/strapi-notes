import Card, { CardProps } from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import { Post } from '@/types'
import Markdown from '@/components/base/Markdown'
import useMarkdown from '@/components/base/Markdown/hooks/useMarkdown'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
export interface PostCardProps {
  post: Post
  onClick?: CardProps['onClick']
}

const PostCard = (props: PostCardProps): JSX.Element => {
  const { post, onClick } = props

  const isAuth = useSelector((state: RootState) => state.auth.isAuth)
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
    markdown.reset({ content: targetContent })
  }, [targetContent])

  return (
    <Card
      sx={[
        {
          height: '100%',
          overflow: 'auto',
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
          <Markdown
            type={isAuth ? 'both' : 'preview'}
            markdownStatus={markdown}
          />
        </Box>
      </CardContent>
    </Card>
  )
}

export default PostCard
