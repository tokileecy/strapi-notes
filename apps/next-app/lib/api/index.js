const PostsQuery = require('../../gql/query/posts.gql')
const PathsQuery = require('../../gql/query/paths.gql')
const TagsQuery = require('../../gql/query/tags.gql')
const client = require('../apollo-client')
const { customInstance, apiInstance } = require('../axios-instance')

const printErrors = (fetchEntityName, response) => {
  if (response.errors) {
    console.warn(`fetching ${fetchEntityName} failed`)
    console.warn(
      response.errors.reduce((acc, error) => acc + error.message + '\n', '')
    )
  }
}

const basePagination = { start: 0, limit: -1 }

class Api {
  constructor() {
    this.jwtToken = undefined
  }

  setJwtToken = (token) => {
    this.jwtToken = token
  }

  /**
   * @param {{
   *   identifier: string
   *   password: string
   * }} param0
   *
   * @returns { import('axios').AxiosResponse<{
   *   jwt: string
   * }> }
   */
  login = ({ identifier, password }) => {
    return apiInstance.post('/auth/local', {
      identifier,
      password,
    })
  }

  getPost = async ({ id }) => {
    try {
      const response = await apiInstance.get(`/posts/${id}`)

      return response.data
    } catch (error) {
      return []
    }
  }

  listPosts = async ({ tags = [], withContent = '1' }) => {
    try {
      const response = await customInstance.get('/posts', {
        params: {
          filters: { tags: { $has_some: tags } },
          with_content: withContent,
        },
      })

      return response.data
    } catch (error) {
      return []
    }
  }

  /**
   *
   * @param {{
   *  content?: string
   *  name?: string
   *  tags?: string[]
   *  path?: string
   * }} data
   * @returns
   */
  createPost = async (data = {}) => {
    try {
      const response = await apiInstance.post(
        '/posts',
        {
          data,
        },
        {
          headers: {
            Authorization: `Bearer ${this.jwtToken}`,
          },
        }
      )

      return response.data
    } catch (error) {
      return []
    }
  }

  /**
   *
   * @param { string } id
   * @param {{
   *  content?: string
   *  name?: string
   *  tags?: string[]
   *  path?: string
   * }} data
   * @returns
   */
  updatePost = async (id, data = {}) => {
    try {
      const response = await apiInstance.update(
        `/posts/${id}`,
        {
          data,
        },
        {
          headers: {
            Authorization: `Bearer ${this.jwtToken}`,
          },
        }
      )

      return response.data
    } catch (error) {
      return []
    }
  }

  /**
   *
   * @param {{
   *  id: string
   * }} options
   * @returns
   */
  deletePost = async (id) => {
    try {
      const response = await apiInstance.delete(`/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${this.jwtToken}`,
        },
      })

      return response.data
    } catch (error) {
      return []
    }
  }

  getTags = async (pagination = basePagination) => {
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
  }
}

export default new Api()
