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
      sx={{
        display: 'flex',
        flexDirection: {
          xs: 'row',
          md: 'column',
        },
        gap: 2,
        minWidth: {
          xs: 'initial',
          md: '250px',
        },
        maxWidth: {
          xs: 'initial',
          md: '400px',
        },
        height: {
          md: '100%',
        },
        width: {
          xs: '100%',
          md: 0,
        },
        borderRight: {
          md: 'dashed 1px white',
        },
        borderBottom: {
          xs: 'dashed 1px white',
          md: 'none',
        },
        padding: {
          xs: 2,
          md: 4,
        },
        overflow: {
          md: 'hidden',
        },
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
