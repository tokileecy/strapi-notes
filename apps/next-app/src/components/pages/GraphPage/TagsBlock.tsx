import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
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
    const name = tags.itemById[id].name
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        justifyContent: 'flex-start',
        pl: 6,
        pr: 6,
        gap: 2,
      }}
    >
      <Tag
        label="All"
        onClick={() => {
          onAllSelected?.()
        }}
        isSelected={isAllSelected}
      />
      <Divider
        orientation="vertical"
        flexItem
        sx={{
          bgcolor: 'white',
          color: 'white',
        }}
      />
      {tagNodes}
    </Box>
  )
}

export default TagsBlock
