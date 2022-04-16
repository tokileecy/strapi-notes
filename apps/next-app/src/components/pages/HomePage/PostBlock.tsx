import Box from '@mui/material/Box'
import PostCard from './PostCard'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const PostBlock = () => {
  const posts = useSelector((state: RootState) => state.posts)

  return (
    <Box
      sx={{
        pt: 2,
        pb: 2,
        pl: 4,
        pr: 4,
        flex: 1,
        height: '100%',
      }}
    >
      <Box
        sx={{
          height: '100%',
          overflowY: 'auto',
          pt: 2,
          pb: 2,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            justifyItems: 'center',
            width: '100%',
            rowGap: 4,
          }}
        >
          {posts.ids.map((id) => {
            return <PostCard key={id} post={posts.itemById[id]} />
          })}
        </Box>
      </Box>
    </Box>
  )
}

export default PostBlock
