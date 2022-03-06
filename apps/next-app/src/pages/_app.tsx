import '../styles/globals.css'
import type { AppProps } from 'next/app'
import store from '@/redux/store'
import Head from 'next/head'
import { Provider } from 'react-redux'
import CssBaseline from '@mui/material/CssBaseline'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <Head>
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
