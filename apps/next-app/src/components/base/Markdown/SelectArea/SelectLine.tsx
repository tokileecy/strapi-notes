import Box from '@mui/material/Box'

export interface SelectLineProps {
  x: number
  y: number
  width: number
  height: number
}

const SelectLine = (props: SelectLineProps) => {
  const { width, height, x, y } = props

  return (
    <Box
      sx={{
        'width': `${width}px`,
        'height': `${height}px`,
        'transform': `translate(${x}px, ${y}px)`,
        'position': 'absolute',
        'backgroundColor': '#efefef',
        'p': 0,
        'm': 0,
        'background': '#191919',
        'userSelect': 'none',
        'pointerEvents': 'none',
        'outline': 'none',
        'whiteSpace': 'break-spaces',
      }}
    ></Box>
  )
}

export default SelectLine
