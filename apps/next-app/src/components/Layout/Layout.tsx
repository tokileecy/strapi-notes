import { ReactNode } from 'react'
import BaseThemeProvider from './BaseThemeProvider'
import Header from './Header'
import Main from './Main'

export interface LayoutProps {
  children?: ReactNode
  headerText?: string
}

const Layout = (props: LayoutProps): JSX.Element => {
  const { headerText, children } = props

  return (
    <BaseThemeProvider>
      <Header text={headerText} />
      <Main>{children}</Main>
    </BaseThemeProvider>
  )
}

export default Layout
