const config = require('next/config')
const axios = require('axios')
const qs = require('qs')
const { publicRuntimeConfig, serverRuntimeConfig } = config.default()

const runtimeConfig =
  typeof document === 'undefined' ? serverRuntimeConfig : publicRuntimeConfig

const { STRAPI_URL } = runtimeConfig

const uri = new URL('/api', STRAPI_URL).href

/** @type {import('axios').AxiosInstance} */
const instance = axios.create({
  baseURL: uri,
  timeout: 10000,
})

instance.defaults.paramsSerializer = (params) => {
  return qs.stringify(params)
}

module.exports = instance
