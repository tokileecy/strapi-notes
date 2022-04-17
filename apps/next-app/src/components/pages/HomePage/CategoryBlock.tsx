import Stack from '@mui/material/Stack'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import Tag from '../../base/Tag'

export interface CategoryBlockProps {
  selectedCategory: string | undefined
  onCategoryClick?: (isSelected: boolean, id: string) => void
  onAllSelected?: () => void
}

const CategoryBlock = (props: CategoryBlockProps): JSX.Element => {
  const { selectedCategory, onCategoryClick, onAllSelected } = props

  const categories = useSelector((state: RootState) => state.categories)

  const categorieNodes = categories.ids.map((categoryId) => {
    const id = categoryId
    const name = categories.itemById[id].attributes.name

    const isSelected = selectedCategory === id

    return (
      <Tag
        key={id}
        label={name}
        isSelected={isSelected}
        onClick={() => {
          onCategoryClick?.(isSelected, id)
        }}
      />
    )
  })

  const isAllSelected = selectedCategory === undefined

  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{
        minWidth: '250px',
        maxWidth: '400px',
        height: '100%',
        borderRight: 'solid 1px white',
        borderStyle: 'dashed',
        padding: 4,
        overflow: 'hidden',
      }}
    >
      <Tag
        label="All"
        onClick={() => {
          onAllSelected?.()
        }}
        isSelected={isAllSelected}
      />
      {categorieNodes}
    </Stack>
  )
}

export default CategoryBlock
