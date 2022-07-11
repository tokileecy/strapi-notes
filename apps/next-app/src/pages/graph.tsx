import type { NextPage, GetServerSideProps } from 'next'
import GraphPage, { GraphPageProps } from '../components/pages/GraphPage'
import api from '@/lib/api'

const Graph: NextPage<GraphPageProps> = (props) => {
  return <GraphPage {...props} />
}

export const getServerSideProps: GetServerSideProps = async () => {
  const tags = await api.getTags()
  const paths = await api.getCustomPosts({ withContent: '0' })

  return {
    props: {
      tags,
      paths,
    },
  }
}

export default Graph
