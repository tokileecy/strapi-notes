import Box from '@mui/material/Box'

export interface PathData {
  name: string
  path: string
  id: string
}

const TmpPathList = (props: { paths: PathData[] }) => {
  const { paths } = props

  return (
    <Box
      sx={{
        color: 'white',
      }}
    >
      <Box>{`Tmp >`}</Box>
      <Box ml={2}>
        {paths.map((path) => {
          return <Box key={path.name}>{path.name}</Box>
        })}
      </Box>
    </Box>
  )
}

export default TmpPathList
