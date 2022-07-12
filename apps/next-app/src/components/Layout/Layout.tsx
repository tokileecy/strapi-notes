import { ReactNode, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setAuth } from '@/redux/features/auth/authSlice'
import { RootState } from '@/redux/store'
import api from '@/lib/api'
import BaseThemeProvider from './BaseThemeProvider'
import Header from './Header'
import Main from './Main'

export interface LayoutProps {
  children?: ReactNode
  headerText?: string
}

const Layout = (props: LayoutProps): JSX.Element => {
  const { headerText, children } = props

  const jwt = useSelector((state: RootState) => state.auth.jwt)

  const dispatch = useDispatch()

  useEffect(() => {
    const jwt = localStorage.getItem('jwt')

    if (jwt) {
      dispatch(setAuth({ jwt }))
    }
  }, [])

  useEffect(() => {
    api.setJwtToken(jwt)
  }, [jwt])

  return (
    <BaseThemeProvider>
      <Header text={headerText} />
      <Main>{children}</Main>
    </BaseThemeProvider>
  )
}

export default Layout
