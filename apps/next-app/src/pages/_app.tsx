import '../styles/globals.css'
import type { AppProps } from 'next/app'
import store from '@/redux/store'
import Head from 'next/head'
import { Provider } from 'react-redux'
import CssBaseline from '@mui/material/CssBaseline'
import { useEffect } from 'react'
import getConfig from 'next/config'
import api from '@/lib/api'

declare global {
  interface Window {
    api: typeof api
  }
}

const { publicRuntimeConfig } = getConfig()

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const { APP_ENV } = publicRuntimeConfig

    if (APP_ENV === 'development') {
      window.api = api
    }
  }, [])

  return (
    <Provider store={store}>
      <Head>
        <link rel="icon" href="/favicon.png" sizes="16x16" type="image/png" />
        {/* <link
          rel="icon"
          type="image/png"
          href="image"
          sizes="32x32"
        /> */}
        {/* <title></title> */}
      </Head>
      <CssBaseline />
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
