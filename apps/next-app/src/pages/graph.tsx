import type { NextPage, GetServerSideProps } from 'next'
import GraphPage, { GraphPageProps } from '@/components/pages/GraphPage'
import HierarchyProvider from '@/providers/HierarchyProvider'
import api from '@/lib/api'
import { Post } from '@/types'

const Graph: NextPage<GraphPageProps> = (props) => {
  return (
    <HierarchyProvider>
      <GraphPage {...props} />
    </HierarchyProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const tags = await api.getTags()

  let posts: Post[]

  try {
    const response = await api.listPosts({ withContent: '0' })

    posts = response.data
  } catch (error) {
    posts = []
  }

  return {
    props: {
      tags,
      posts,
    },
  }
}

export default Graph
