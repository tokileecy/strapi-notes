const PostsQuery = require('../../gql/query/posts.gql')
const PathsQuery = require('../../gql/query/paths.gql')
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

  async getPosts(pagination = basePagination) {
    const variables = {
      pagination,
    }

    const response = await client.query({
      query: PostsQuery,
      variables,
    })

    printErrors('posts', response)

    const postDatas = response.data.posts?.data ?? []

    return postDatas
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

    const tagsDatas =
      response.data.tags?.data.map((tag) => ({
        id: tag.id,
        name: tag.attributes.name,
      })) ?? []

    return tagsDatas
  },

  async getPaths() {
    const variables = {
      pagination: basePagination,
    }

    const response = await client.query({
      query: PathsQuery,
      variables,
    })

    printErrors('paths', response)

    const pathsDatas = (response.data.posts?.data ?? []).reduce((acc, post) => {
      const path = post.attributes.path

      if (path) {
        acc.push(path)
      }

      return acc
    }, [])

    return pathsDatas
  },
}

export default api
