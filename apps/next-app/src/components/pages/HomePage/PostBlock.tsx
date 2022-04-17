import Box from '@mui/material/Box'
import PostCard from './PostCard'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useState } from 'react'
import PostDialog from './PostDialog'
import { Post } from '@/redux/features/posts/postSlice'

const PostBlock = () => {
  const [open, setOpen] = useState(false)
  const [selectedPost, setSelectePost] = useState<Post | null>(null)
  const posts = useSelector((state: RootState) => state.posts)

  const handleClose = () => {
    setOpen(false)
  }

  const handleTransitionExited = () => {
    setSelectePost(null)
  }

  let repeatCol = 4

  if (posts.ids.length < 4) {
    repeatCol = posts.ids.length
  }

  return (
    <Box
      sx={{
        pt: 2,
        pb: 2,
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
          pl: 4,
          pr: 4,
        }}
      >
        <PostDialog
          open={open}
          onClose={handleClose}
          post={selectedPost}
          TransitionProps={{
            onExited: () => {
              handleTransitionExited()
            },
          }}
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${repeatCol}, 1fr)`,
            justifyItems: 'center',
            width: '100%',
            rowGap: 4,
          }}
        >
          {posts.ids.map((id) => {
            return (
              <PostCard
                key={id}
                post={posts.itemById[id]}
                onClick={() => {
                  setOpen((prev) => !prev)
                  setSelectePost(posts.itemById[id])
                }}
              />
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}

export default PostBlock
