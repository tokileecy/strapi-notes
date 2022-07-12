import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { setAuth } from '@/redux/features/auth/authSlice'
import { RootState } from '@/redux/store'
import LoginDialog from '../LoginDialog'

const Header = (props: { text?: string }) => {
  const { text = 'Toki Notes' } = props

  const [open, setOpen] = useState(false)

  const jwt = useSelector((state: RootState) => state.auth.jwt)
  const dispatch = useDispatch()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('jwt')
    dispatch(setAuth({ jwt: undefined }))
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <AppBar>
      <Box
        sx={{
          pl: 4,
          pr: 4,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
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
              {text}
            </Typography>
          </Box>
          {!jwt ? (
            <Button variant="text">
              <Typography
                sx={{
                  fontSize: '16px',
                  color: 'white',
                  fontWeight: 'bold',
                }}
                onClick={handleClickOpen}
              >
                Login
              </Typography>
            </Button>
          ) : (
            <Button variant="text">
              <Typography
                sx={{
                  fontSize: '16px',
                  color: 'white',
                  fontWeight: 'bold',
                }}
                onClick={handleLogout}
              >
                Logout
              </Typography>
            </Button>
          )}
          <LoginDialog open={open} onClose={handleClose} />
        </Toolbar>
      </Box>
    </AppBar>
  )
}

export default Header
