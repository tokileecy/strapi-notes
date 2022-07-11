import type { NextPage, GetServerSideProps } from 'next'
import GraphPage, { GraphPageProps } from '@/components/pages/GraphPage'
import HierarchyProvider from '@/providers/HierarchyProvider'
import api from '@/lib/api'

const Graph: NextPage<GraphPageProps> = (props) => {
  return (
    <HierarchyProvider>
      <GraphPage {...props} />
    </HierarchyProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const tags = await api.getTags()
  const posts = await api.getCustomPosts({ withContent: '0' })

  return {
    props: {
      tags,
      posts,
    },
  }
}

export default Graph
