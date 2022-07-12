import { useState } from 'react'
import { AxiosError } from 'axios'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import Box from '@mui/material/Box'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import api from '@/lib/api'
import { setAuth } from '@/redux/features/auth/authSlice'

interface LoginFormFieldData {
  email: string
  password: string
}

export interface LoginDialogProps {
  open: boolean
  onClose?: () => void
}

const LoginDialog = (props: LoginDialogProps) => {
  const { open, onClose } = props

  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<LoginFormFieldData>()

  const dispatch = useDispatch()

  const [rememberMe, setRememberMe] = useState(false)
  const [formError, setFormError] = useState('')

  const handleClose = () => {
    onClose?.()
    clearErrors()
    reset()
  }

  const handleLogin = async (data: LoginFormFieldData) => {
    try {
      const res = await api.login({
        identifier: data.email,
        password: data.password,
      })

      if (rememberMe) {
        localStorage.setItem('jwt', res.data.jwt)
      }

      dispatch(setAuth({ jwt: res.data.jwt }))

      handleClose()
    } catch (error) {
      const err = error as AxiosError

      setFormError(err.response?.data.error.message)
      return error
    }
  }

  const hadleCheckRememberMe: CheckboxProps['onChange'] = (e) => {
    setRememberMe(e.target.checked)
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box component="form" onSubmit={handleSubmit(handleLogin)}>
        <DialogTitle
          sx={{
            margin: 'auto',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          Login
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '400px',
            height: '200px',
            p: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              gap: 2,
              flexDirection: 'column',
            }}
          >
            <Typography
              sx={{
                'color': 'red',
                'textAlign': 'center',
                'fontSize': '0.875rem',
                '&:empty': {
                  height: '1.5em',
                },
              }}
            >
              {formError}
            </Typography>
            <TextField
              required
              id="email"
              label="Email"
              type="email"
              defaultValue=""
              variant="standard"
              helperText={errors.email?.message}
              {...register('email', { required: true })}
            />
            <TextField
              required
              id="password"
              label="Password"
              type="password"
              defaultValue=""
              variant="standard"
              helperText={errors.password?.message}
              {...register('password', { required: true })}
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={rememberMe}
                  onChange={hadleCheckRememberMe}
                />
              }
              label="remember me"
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 3,
          }}
        >
          <Button
            sx={{ width: '100%', fontWeight: 'bold' }}
            variant="contained"
            type="submit"
          >
            Login
          </Button>
          <Button sx={{ width: '100%' }} onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default LoginDialog
