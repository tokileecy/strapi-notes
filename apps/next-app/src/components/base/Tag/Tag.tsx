import Chip, { ChipProps } from '@mui/material/Chip'

export interface TagProps extends ChipProps {
  isSelected: boolean
}

const Tag = (inProps: TagProps): JSX.Element => {
  const { isSelected, ...props } = inProps

  const backgroundColor = isSelected
    ? 'tagBgColorPrimary.main'
    : 'tagBgColorDefault.main'

  const color = isSelected ? 'tagColorPrimary.main' : 'tagColorDefault.main'

  const hoverBackgroundColor = isSelected
    ? 'tagBgColorPrimary.main'
    : 'tagBgColorDefault.main'

  const hoverColor = isSelected
    ? 'tagColorPrimary.main'
    : 'tagColorDefault.main'

  return (
    <Chip
      sx={[
        {
          '&:hover': {
            color: hoverColor,
            backgroundColor: hoverBackgroundColor,
          },
        },
        {
          backgroundColor,
          color,
          fontWeight: 'bold',
        },
      ]}
      {...props}
    />
  )
}

export default Tag
