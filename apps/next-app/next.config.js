/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    APP_ENV: process.env?.APP_ENV ?? 'development',
    STRAPI_API_TOKEN: process.env?.STRAPI_API_TOKEN ?? '',
    STRAPI_URL: process.env?.SERVER_STRAPI_URL ?? 'http://127.0.0.1:1337/',
  },
  publicRuntimeConfig: {
    APP_ENV: process.env?.APP_ENV ?? 'development',
    STRAPI_URL: process.env?.PUBLIC_STRAPI_URL ?? 'http://127.0.0.1:1337/',
  },
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      }
    )

    return config
  },
}

module.exports = nextConfig
