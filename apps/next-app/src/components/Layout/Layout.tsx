import { ReactNode, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setAuth } from '@/redux/features/auth/authSlice'
import BaseThemeProvider from './BaseThemeProvider'
import Header from './Header'
import Main from './Main'
export interface LayoutProps {
  children?: ReactNode
  headerText?: string
}

const Layout = (props: LayoutProps): JSX.Element => {
  const { headerText, children } = props
  const dispatch = useDispatch()

  useEffect(() => {
    const jwt = localStorage.getItem('jwt')

    if (jwt) {
      dispatch(setAuth({ jwt }))
    }
  }, [])
  return (
    <BaseThemeProvider>
      <Header text={headerText} />
      <Main>{children}</Main>
    </BaseThemeProvider>
  )
}

export default Layout
