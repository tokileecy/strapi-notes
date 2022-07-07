import { useEffect } from 'react'
import Layout from '../../Layout'
import Box from '@mui/material/Box'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setTags, Tag } from '@/redux/features/tags/tagSlice'
import { setPosts, Post } from '@/redux/features/posts/postSlice'
import {
  clearTags,
  removeTags,
  addTags,
} from '@/redux/features/global/globalSlice'
import api from '@/lib/api'
import TagsBlock from './TagsBlock'
import PostBlock from './PostBlock'

export interface HomePageProps {
  tags: Tag[]
}

const HomePage = (props: HomePageProps): JSX.Element => {
  const { tags } = props
  const dispatch = useDispatch()

  const selectedTags = useSelector(
    (state: RootState) => state.global.selectedTags
  )

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
      const posts: Post[] = await api.getCustomPosts(
        Array.from(Object.keys(selectedTags))
      )

      const ids: number[] = []
      const itemById: Record<number, Post> = {}

      posts.forEach((post) => {
        ids.push(post.id)
        itemById[post.id] = post
      })

      dispatch(setPosts({ ids, itemById }))
    }

    fetchData()
  }, [selectedTags])

  return (
    <Layout>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: {
            xs: 'column',
            md: 'row',
          },
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexGrow: 1,
            height: {
              xs: 0,
              md: '100%',
            },
            width: {
              xs: 'initial',
              md: 0,
            },
          }}
        >
          <TagsBlock
            selectedTags={selectedTags}
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
          <PostBlock />
        </Box>
      </Box>
    </Layout>
  )
}

export default HomePage
