const PostsQuery = require('../../gql/query/posts.gql')
const CategoriesQuery = require('../../gql/query/categories.gql')
const TagsQuery = require('../../gql/query/tags.gql')
const client = require('../apollo-client')
const { customInstance } = require('../axios-instance')

const printErrors = (fetchEntityName, response) => {
  if (response.errors) {
    console.warn(`fetching ${fetchEntityName} failed`)
    console.warn(
      response.errors.reduce((acc, error) => acc + error.message + '\n', '')
    )
  }
}

const basePagination = { start: 0, limit: -1 }

const api = {
  async getCustomPosts(tags = []) {
    try {
      const response = await customInstance.get('/posts', {
        params: { filters: { tags: { $has_some: tags } } },
      })

      return response.data
    } catch (error) {
      return []
    }
  },

  async getPosts(categories = [], pagination = basePagination) {
    const variables = {
      pagination,
    }

    if (categories.length > 0) {
      variables.categories = categories
    }

    const response = await client.query({
      query: PostsQuery,
      variables,
    })

    printErrors('posts', response)

    const postDatas = response.data.posts?.data ?? []

    return postDatas
  },

  async getCategories(pagination = basePagination) {
    const variables = {
      pagination,
    }

    const response = await client.query({
      query: CategoriesQuery,
      variables,
    })

    printErrors('categories', response)

    const categoriesDatas = response.data.categories?.data ?? []

    return categoriesDatas
  },

  async getTags(pagination = basePagination) {
    const variables = {
      pagination,
    }

    const response = await client.query({
      query: TagsQuery,
      variables,
    })

    printErrors('tags', response)

    const tagsDatas = response.data.tags?.data ?? []

    return tagsDatas
  },
}

export default api
