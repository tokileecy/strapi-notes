import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const Header = () => {
  return (
    <AppBar>
      <Box
        sx={{
          pl: 4,
          pr: 4,
        }}
      >
        <Toolbar>
          <Box
            component="a"
            sx={{
              width: 254,
            }}
          >
            <Typography
              sx={{
                fontSize: '24px',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              Toki Notes
            </Typography>
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  )
}

export default Header
