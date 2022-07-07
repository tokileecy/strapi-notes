import { useEffect } from 'react'
import Layout from '../../Layout'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setTags, Tag } from '@/redux/features/tags/tagSlice'
import { setPosts, Post } from '@/redux/features/posts/postSlice'
import api from '@/lib/api'
import BackgroundGraph from '@/components/pages/GraphPage/BackgroundGraph'

export interface GraphPageProps {
  tags: Tag[]
}

const GraphPage = (props: GraphPageProps): JSX.Element => {
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
      <BackgroundGraph />
    </Layout>
  )
}

export default GraphPage
