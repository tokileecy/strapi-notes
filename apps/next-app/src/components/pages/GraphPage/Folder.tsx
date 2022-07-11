import { useMemo, useContext } from 'react'
import Box from '@mui/material/Box'
import FolderNode from '@/core/FolderNode'
import FolderStateContext from './FolderStateContext'

const Folder = (props: { node: FolderNode }) => {
  const { node } = props
  const { pathState, onPathChange } = useContext(FolderStateContext)
  const childrens = Array.from(Object.values(node.children))

  const selected = useMemo(() => {
    return pathState[node.absolutePath]?.selected ?? false
  }, [pathState[node.absolutePath]])

  return (
    <Box
      sx={{
        'color': 'white',
      }}
    >
      <Box
        sx={{
          'backgroundColor': selected ? 'gray' : 'initial',
          '&:hover': {
            cursor: 'pointer',
            backgroundColor: 'gray',
          },
        }}
        onClick={() => {
          onPathChange?.(node.absolutePath)
        }}
      >
        {node.path}
      </Box>
      <Box ml={2}>
        {childrens.map((children, index) => {
          return <Folder key={children.path + index} node={children} />
        })}
      </Box>
    </Box>
  )
}

export default Folder
