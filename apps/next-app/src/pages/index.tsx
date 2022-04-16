import type { NextPage, GetStaticProps } from 'next'
import HomePage, { HomePageProps } from '../components/pages/HomePage/HomePage'
import api from '@/lib/api'

const Home: NextPage<HomePageProps> = (props) => {
  return <HomePage {...props} />
}

export const getStaticProps: GetStaticProps = async () => {
  const categories = await api.getCategories()
  const tags = await api.getTags()

  return {
    props: {
      categories,
      tags,
    },
  }
}

export default Home
