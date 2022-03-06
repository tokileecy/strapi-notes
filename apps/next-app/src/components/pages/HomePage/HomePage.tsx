import Layout from '../../Layout'
import Box from '@mui/material/Box'

const HomePage = () => {
  return (
    <Layout>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          pl: 8,
          pr: 8,
          pt: 4,
        }}
      ></Box>
    </Layout>
  )
}

export default HomePage
