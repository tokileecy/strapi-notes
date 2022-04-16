import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

export interface TagsBlockProps {
  selectedTags: Record<string, boolean>
  onClick?: (isSelected: boolean, id: string) => void
}

const TagsBlock = (props: TagsBlockProps): JSX.Element => {
  const { selectedTags, onClick } = props
  const tags = useSelector((state: RootState) => state.tags)

  const tagNodes = tags.ids.map((tagId) => {
    const id = tagId
    const name = tags.itemById[id].attributes.name
    const isSelected = selectedTags[id] ?? false

    const backgroundColor = isSelected
      ? 'tagBgColorPrimary.main'
      : 'tagBgColorDefault.main'

    const color = isSelected ? 'tagColorPrimary.main' : 'tagColorDefault.main'

    return (
      <Chip
        key={id}
        label={name}
        sx={[
          {
            '&:hover': {
              color: 'tagColorPrimary.main',
              backgroundColor: 'tagBgColorPrimary.main',
            },
          },
          {
            backgroundColor,
            color,
          },
        ]}
        onClick={() => {
          onClick?.(isSelected, id)
        }}
      />
    )
  })

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        pt: 3,
        pb: 3,
      }}
    >
      {tagNodes}
    </Stack>
  )
}

export default TagsBlock
