import Layout from '../Layout'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'

const LoginTextField = (props: TextFieldProps): JSX.Element => {
  return (
    <TextField
      sx={{
        mb: 2,
        width: 350,
      }}
      {...props}
    />
  )
}

const LoginPaper = () => {
  return (
    <Paper
      elevation={2}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
      }}
    >
      <LoginTextField id="login-email" label="email" type="email" />
      <LoginTextField id="login-password" label="password" type="password" />
      <Button
        variant="contained"
        sx={{
          width: '350px',
        }}
      >
        Login
      </Button>
    </Paper>
  )
}

const HomePage = () => {
  return (
    <Layout>
      <Typography
        sx={{
          fontSize: '36px',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        Login
      </Typography>
      <LoginPaper />
    </Layout>
  )
}

export default HomePage
