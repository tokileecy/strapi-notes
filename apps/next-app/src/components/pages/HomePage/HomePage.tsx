import { useEffect } from 'react'
import Layout from '../../Layout'
import Box from '@mui/material/Box'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import {
  setCategories,
  Category,
} from '@/redux/features/categories/categorySlice'
import { setTags, Tag } from '@/redux/features/tags/tagSlice'
import { setPosts, Post } from '@/redux/features/posts/postSlice'
import {
  // setCategory,
  // clearCategory,
  clearTags,
  removeTags,
  addTags,
} from '@/redux/features/global/globalSlice'
import api from '@/lib/api'
// import CategoryBlock from './CategoryBlock'
import TagsBlock from './TagsBlock'
import PostBlock from './PostBlock'

export interface HomePageProps {
  categories: Category[]
  tags: Tag[]
}

const HomePage = (props: HomePageProps): JSX.Element => {
  const { categories, tags } = props
  const dispatch = useDispatch()

  const selectedTags = useSelector(
    (state: RootState) => state.global.selectedTags
  )

  // const selectedCategory = useSelector(
  //   (state: RootState) => state.global.selectedCategory
  // )

  useEffect(() => {
    const tagIds: string[] = []
    const tagItemById: Record<string, Tag> = {}
    const categoryIds: string[] = []
    const categoryItemById: Record<string, Tag> = {}

    tags.forEach((tag) => {
      tagIds.push(tag.id)
      tagItemById[tag.id] = tag
    })

    categories.forEach((category) => {
      categoryIds.push(category.id)
      categoryItemById[category.id] = category
    })

    dispatch(
      setCategories({
        ids: categoryIds,
        itemById: categoryItemById,
      })
    )
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
        {/* <CategoryBlock
          selectedCategory={selectedCategory}
          onCategoryClick={(isSelected, id) => {
            if (isSelected) {
              dispatch(clearCategory())
            } else {
              dispatch(setCategory(id))
            }
          }}
          onAllSelected={() => {
            dispatch(clearCategory())
          }}
        /> */}
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
