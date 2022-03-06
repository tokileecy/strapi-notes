import { Container, Box } from '@mui/material'

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{ backgroundColor: '#0e0e0e', width: '100%', minHeight: 100 }}
    >
      <Container
        sx={{
          paddingTop: 2,
          paddingBottom: 2,
        }}
      >
        <Box
          sx={{
            width: 212,
          }}
        ></Box>
      </Container>
    </Box>
  )
}

export default Footer
