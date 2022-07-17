import Box from '@mui/material/Box'

const EndLine = () => {
  return (
    <Box
      sx={{
        height: 0,
        m: 0,
        border: 'none',
      }}
    >
      <Box
        component="pre"
        data-type="end"
        sx={{
          height: 0,
          m: 0,
          border: 'none',
        }}
      >
        &#8203;
      </Box>
    </Box>
  )
}

export default EndLine
