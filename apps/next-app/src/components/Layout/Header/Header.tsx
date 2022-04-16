import AppBar from '@mui/material/AppBar'
import { Container, Toolbar, Box } from '@mui/material'

const Header = () => {
  return (
    <AppBar>
      <Box>
        <Container>
          <Toolbar>
            <Box
              component="a"
              sx={{
                width: 254,
              }}
            >
              Toki Notes
            </Box>
          </Toolbar>
        </Container>
      </Box>
    </AppBar>
  )
}

export default Header
