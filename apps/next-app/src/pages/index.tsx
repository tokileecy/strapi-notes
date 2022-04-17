import type { NextPage, GetServerSideProps } from 'next'
import HomePage, { HomePageProps } from '../components/pages/HomePage/HomePage'
import api from '@/lib/api'

const Home: NextPage<HomePageProps> = (props) => {
  return <HomePage {...props} />
}

export const getServerSideProps: GetServerSideProps = async () => {
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
