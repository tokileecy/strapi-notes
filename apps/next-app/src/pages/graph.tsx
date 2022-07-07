import type { NextPage, GetServerSideProps } from 'next'
import GraphPage, { GraphPageProps } from '../components/pages/GraphPage'
import api from '@/lib/api'

const Graph: NextPage<GraphPageProps> = (props) => {
  return <GraphPage {...props} />
}

export const getServerSideProps: GetServerSideProps = async () => {
  const tags = await api.getTags()

  return {
    props: {
      tags,
    },
  }
}

export default Graph
