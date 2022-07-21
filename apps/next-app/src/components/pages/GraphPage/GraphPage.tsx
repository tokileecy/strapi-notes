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
import useHierarchy from '@/hooks/useHierarchy'
export interface GraphPageProps {
  tags: Tag[]
  posts: Post[]
}

const GraphPage = (props: GraphPageProps): JSX.Element => {
  const { tags } = props

  const dispatch = useDispatch()

  const { selectedPost, relativePosts, relativeTags, relativeSelectedTags } =
    useHierarchy()

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
      let posts: Post[]

      try {
        const response = await api.listPosts({})

        posts = response.data
      } catch (error) {
        posts = []
      }

      const ids: string[] = []
      const itemById: Record<string, Post> = {}

      posts.forEach((post) => {
        ids.push(post.id)
        itemById[post.id] = post
      })

      dispatch(setPosts({ ids, itemById }))
    }

    fetchData()
  }, [])

  return (
    <Layout headerText="Toki Notes (Dev)">
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            width: '100%',
          }}
        >
          <Box
            sx={{
              p: 2,
              m: 2,
              borderRadius: 2,
              backgroundColor: 'rgba(15, 108, 176, 0.24)',
            }}
          >
            <TagsBlock
              tags={relativeTags}
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
              flexGrow: 1,
              display: 'flex',
              justifyContent: { lg: 'space-between' },
              alignItems: { lg: 'center' },
              flexDirection: {
                xs: 'column',
                lg: 'row',
              },
            }}
          >
            <Box
              sx={{
                m: 2,

                height: {
                  xs: `35%`,
                  lg: `80%`,
                },
                width: {
                  lg: `300px`,
                },
              }}
            >
              <Box
                sx={{
                  p: 2,
                  overflow: 'auto',
                  height: '100%',
                  borderRadius: 2,
                  backgroundColor: 'rgba(15, 108, 176, 0.24)',
                }}
              >
                <Hierarchy />
              </Box>
            </Box>

            {selectedPost && (
              <Box
                sx={{
                  m: 2,
                  flexGrow: 1,
                  height: {
                    xs: `35%`,
                    lg: `80%`,
                  },

                  maxWidth: {
                    lg: `900px`,
                  },
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    height: '100%',
                    borderRadius: 2,
                    backgroundColor: 'rgba(15, 108, 176, 0.24)',
                  }}
                >
                  <PostCard post={selectedPost} />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            zIndex: 0,
            height: '100%',
            width: '100%',
          }}
        >
          <BackgroundGraph tags={relativeSelectedTags} posts={relativePosts} />
        </Box>
      </Box>
    </Layout>
  )
}

export default GraphPage
