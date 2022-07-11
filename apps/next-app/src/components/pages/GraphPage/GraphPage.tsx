import { useEffect } from 'react'
import Box from '@mui/material/Box'
import { useDispatch } from 'react-redux'
import { setTags } from '@/redux/features/tags/tagSlice'
import { setPosts } from '@/redux/features/posts/postSlice'
import { Post, Tag } from '@/types'
import {
  clearTags,
  removeTags,
  addTags,
} from '@/redux/features/global/globalSlice'
import api from '@/lib/api'
import BackgroundGraph from '@/components/pages/GraphPage/BackgroundGraph'
import Layout from '../../Layout'
import PostCard from './PostCard'
import TagsBlock from './TagsBlock'
import Hierarchy from './Hierarchy'
import useSelectedTags from './useSelectedTags'
import useHierarchy from '@/hooks/useHierarchy'
export interface GraphPageProps {
  tags: Tag[]
  posts: Post[]
}

const GraphPage = (props: GraphPageProps): JSX.Element => {
  const { tags } = props

  const dispatch = useDispatch()

  const { ids: selectedTagIds, tags: selectedTags } = useSelectedTags()

  const { selectedPost, relativePosts } = useHierarchy()

  useEffect(() => {
    const tagIds: string[] = []
    const tagItemById: Record<string, Tag> = {}

    tags.forEach((tag) => {
      tagIds.push(tag.id.toString())
      tagItemById[tag.id] = tag
    })

    dispatch(setTags({ ids: tagIds, itemById: tagItemById }))
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const posts: Post[] = await api.getCustomPosts({
        tags: selectedTagIds,
      })

      const ids: string[] = []
      const itemById: Record<string, Post> = {}

      posts.forEach((post) => {
        ids.push(post.id)
        itemById[post.id] = post
      })

      dispatch(setPosts({ ids, itemById }))
    }

    fetchData()
  }, [selectedTagIds])

  return (
    <Layout>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '300px',
            zIndex: 2,
            left: 0,
            p: 2,
            m: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(15, 108, 176, 0.24)',
          }}
        >
          <Hierarchy tags={tags} />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            zIndex: 2,
            top: 0,
            left: '50%',
            transform: 'translateX(-70%)',
            p: 2,
            m: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(15, 108, 176, 0.24)',
          }}
        >
          <TagsBlock
            onAllSelected={() => {
              dispatch(clearTags())
            }}
            onTagSelected={(isSelected, id) => {
              if (isSelected) {
                dispatch(removeTags([id]))
              } else {
                dispatch(addTags([id]))
              }
            }}
          />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            zIndex: 2,
            right: 0,
            height: '100%',
            p: 2,
          }}
        >
          {selectedPost && <PostCard post={selectedPost} />}
        </Box>
        <Box
          sx={{
            position: 'absolute',
            zIndex: 0,
            height: '100%',
          }}
        >
          <BackgroundGraph tags={selectedTags} posts={relativePosts} />
        </Box>
      </Box>
    </Layout>
  )
}

export default GraphPage
