const config = require('next/config')
const fetch = require('cross-fetch')
const apolloClientPkg = require('@apollo/client')

const { ApolloClient, InMemoryCache, HttpLink } = apolloClientPkg

const { publicRuntimeConfig, serverRuntimeConfig } = config.default()

const runtimeConfig =
  typeof document === 'undefined' ? serverRuntimeConfig : publicRuntimeConfig

const { STRAPI_URL } = runtimeConfig

const uri = new URL('graphql', STRAPI_URL).href

const client = new ApolloClient({
  uri,
  fetch,
  link: new HttpLink({ uri, fetch }),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
})

module.exports = client
