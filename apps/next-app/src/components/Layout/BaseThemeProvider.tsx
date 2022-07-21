import { ReactNode } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { ParallaxProvider } from 'react-scroll-parallax'

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    tagBgColorDefault: Palette['primary']
    tagColorDefault: Palette['primary']
    tagBgColorPrimary: Palette['primary']
    tagColorPrimary: Palette['primary']
  }
  interface PaletteOptions {
    tagBgColorDefault: PaletteOptions['primary']
    tagColorDefault: PaletteOptions['primary']
    tagBgColorPrimary: PaletteOptions['primary']
    tagColorPrimary: PaletteOptions['primary']
  }
}

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 900,
      lg: 1280,
      xl: 1440,
    },
  },
  palette: {
    primary: {
      main: 'rgb(3, 147, 187)',
    },
    tagBgColorPrimary: {
      main: 'rgb(3, 147, 187)',
    },
    tagColorPrimary: {
      main: '#ffffff',
    },
    tagBgColorDefault: {
      main: '#ffffff',
    },
    tagColorDefault: {
      main: '#000000',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          position: 'fixed',
          zIndex: 1000,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          margin: 'auto',
          width: ['100%', '100%', '95%'],
          maxWidth: 'initial',
        },
      },
    },
  },
})

export interface ThemeProviderProps {
  children: ReactNode
}

const BaseThemeProvider = (props: ThemeProviderProps): JSX.Element => {
  const { children } = props

  return (
    <ThemeProvider theme={theme}>
      <ParallaxProvider>{children}</ParallaxProvider>
    </ThemeProvider>
  )
}

export default BaseThemeProvider
