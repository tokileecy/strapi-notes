import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import { RootState } from '@/redux/store'
import FolderNode from '@/core/FolderNode'

export interface FolderProps {
  isRoot?: boolean
  node: FolderNode
  onSelectedPathChange?: (path: string) => void
}

const Folder = (props: FolderProps) => {
  const { isRoot, node, onSelectedPathChange } = props

  const selected = useSelector(
    (state: RootState) =>
      state.global.selectedByPath[node.absolutePath] ?? false
  )

  const subFolders = useMemo(() => {
    const childrens = Array.from(Object.values(node.children))

    return (
      <Box ml={isRoot ? 0 : 3}>
        {childrens.map((children, index) => {
          return (
            <Folder
              key={children.path + index}
              node={children}
              onSelectedPathChange={onSelectedPathChange}
            />
          )
        })}
      </Box>
    )
  }, [node])

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
          onSelectedPathChange?.(node.absolutePath)
        }}
      >
        {node.path}
      </Box>
      {subFolders}
    </Box>
  )
}

export default Folder
