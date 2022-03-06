import { ReactNode } from 'react'
import BaseThemeProvider from './BaseThemeProvider'
import Header from './Header'
import Footer from './Footer'
import Main from './Main'

export interface LayoutProps {
  children?: ReactNode
}

const Layout = (props: LayoutProps): JSX.Element => {
  const { children } = props

  return (
    <BaseThemeProvider>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </BaseThemeProvider>
  )
}

export default Layout
