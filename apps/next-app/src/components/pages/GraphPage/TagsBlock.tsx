import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import Tag from '../../base/Tag'
import { Tag as TagData } from '@/types'
export interface TagsBlockProps {
  tags: TagData[]
  onTagSelected?: (isSelected: boolean, id: string) => void
  onAllSelected?: () => void
}

const TagsBlock = (props: TagsBlockProps): JSX.Element => {
  const { tags, onTagSelected, onAllSelected } = props

  const selectedTagSet = useSelector(
    (state: RootState) => state.global.selectedTagSet
  )

  const tagNodes = tags.map((tag) => {
    const isSelected = selectedTagSet[tag.id] ?? false

    return (
      <Tag
        key={tag.id}
        label={tag.name}
        onClick={() => {
          onTagSelected?.(isSelected, tag.id)
        }}
        isSelected={isSelected}
      />
    )
  })

  const isAllSelected = [...Object.keys(selectedTagSet)].length === 0

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
