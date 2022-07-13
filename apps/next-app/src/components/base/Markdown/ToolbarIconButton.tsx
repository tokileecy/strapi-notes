import IconButton from '@mui/material/IconButton'
import SvgIcon from '@mui/material/SvgIcon'

export interface ToolbarIconButtonProps {
  component: any
  onClick?: () => void
}

const ToolbarIconButton = (props: ToolbarIconButtonProps) => {
  const { component, onClick } = props

  return (
    <IconButton
      sx={{
        color: 'white',
        border: '1px solid white',
        borderRadius: 1,
        p: 0.25,
      }}
      onClick={onClick}
    >
      <SvgIcon
        component={component}
        sx={{ width: '20px', height: '20px' }}
      ></SvgIcon>
    </IconButton>
  )
}

export default ToolbarIconButton
