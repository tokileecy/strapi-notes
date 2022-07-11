import Box from '@mui/material/Box'
import FolderNode from '@/core/FolderNode'
import Folder from './Folder'

const Workspace = (props: {
  node: FolderNode | null
  onSelectedPathChange?: (path: string) => void
}) => {
  const { node, onSelectedPathChange } = props

  return (
    <Box
      sx={{
        color: 'white',
      }}
    >
      {`Workspace`}
      <Box>
        {node && (
          <Folder
            isRoot
            onSelectedPathChange={onSelectedPathChange}
            node={node}
          />
        )}
      </Box>
    </Box>
  )
}

export default Workspace
