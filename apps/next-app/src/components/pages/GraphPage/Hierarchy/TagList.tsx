import Box from '@mui/material/Box'
import { Tag } from '@/types'

const TagList = (props: { tags: Tag[] }) => {
  const { tags } = props

  return (
    <Box
      sx={{
        color: 'white',
      }}
    >
      <Box>{`Tags >`}</Box>
      <Box ml={2}>
        {tags.map((tag) => {
          return <Box key={tag.id}>{tag.name}</Box>
        })}
      </Box>
    </Box>
  )
}

export default TagList
