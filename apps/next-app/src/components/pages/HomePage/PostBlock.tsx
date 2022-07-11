import Box from '@mui/material/Box'
import PostCard from './PostCard'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useState } from 'react'
import PostDialog from './PostDialog'
import { Post } from '@/types'

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

  const getRepeatCol = (limit: number) => {
    let repeatCol = limit

    if (posts.ids.length < limit) {
      repeatCol = posts.ids.length
    }

    return repeatCol
  }

  return (
    <Box
      sx={{
        flex: 1,
        width: '100%',
        height: 0,
        pt: 4,
      }}
    >
      <Box
        sx={{
          height: '100%',
          overflowY: 'auto',
          pb: 4,
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
          sx={[
            {
              display: 'grid',
              gridTemplateColumns: {
                xs: `repeat(1, 1fr)`,
                sm: `repeat(${getRepeatCol(2)}, 1fr)`,
                md: `repeat(${getRepeatCol(3)}, 1fr)`,
                lg: `repeat(${getRepeatCol(4)}, 1fr)`,
              },
              justifyItems: 'center',
              width: '100%',
              rowGap: 4,
            },
          ]}
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
