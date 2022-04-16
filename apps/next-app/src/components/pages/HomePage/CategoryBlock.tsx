import Stack from '@mui/material/Stack'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import Chip, { ChipProps } from '@mui/material/Chip'

export const Category = (props: ChipProps): JSX.Element => {
  return <Chip label="Chip Filled" {...props} />
}

export interface CategoryBlockProps {
  selectedCategory: string | undefined
  onClick?: (isSelected: boolean, id: string) => void
}

const CategoryBlock = (props: CategoryBlockProps): JSX.Element => {
  const { selectedCategory, onClick } = props
  const categories = useSelector((state: RootState) => state.categories)

  const categorieNodes = categories.ids.map((categoryId) => {
    const id = categoryId
    const name = categories.itemById[id].attributes.name

    const isSelected = selectedCategory === id

    const backgroundColor = isSelected
      ? 'tagBgColorPrimary.main'
      : 'tagBgColorDefault.main'

    const color = isSelected ? 'tagColorPrimary.main' : 'tagColorDefault.main'

    return (
      <Category
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
            width: 'fit-content',
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
      direction="column"
      spacing={2}
      maxHeight="600px"
      sx={{
        border: 'solid 1px white',
        borderStyle: 'dashed',
        padding: 6,
        overflow: 'hidden',
      }}
    >
      {categorieNodes}
    </Stack>
  )
}

export default CategoryBlock
