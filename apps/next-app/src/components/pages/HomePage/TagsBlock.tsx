import Stack from '@mui/material/Stack'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import Tag from '../../base/Tag'
export interface TagsBlockProps {
  selectedTags: Record<string, boolean>
  onTagSelected?: (isSelected: boolean, id: string) => void
  onAllSelected?: () => void
}

const TagsBlock = (props: TagsBlockProps): JSX.Element => {
  const { selectedTags, onTagSelected, onAllSelected } = props
  const tags = useSelector((state: RootState) => state.tags)

  const tagNodes = tags.ids.map((tagId) => {
    const id = tagId
    const name = tags.itemById[id].attributes.name
    const isSelected = selectedTags[id] ?? false

    return (
      <Tag
        key={id}
        label={name}
        onClick={() => {
          onTagSelected?.(isSelected, id)
        }}
        isSelected={isSelected}
      />
    )
  })

  const isAllSelected = [...Object.keys(selectedTags)].length === 0

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        width: '100%',
        justifyContent: 'center',
        p: 4,
        pb: 0,
      }}
    >
      <Tag
        label="All"
        onClick={() => {
          onAllSelected?.()
        }}
        isSelected={isAllSelected}
      />
      {tagNodes}
    </Stack>
  )
}

export default TagsBlock
