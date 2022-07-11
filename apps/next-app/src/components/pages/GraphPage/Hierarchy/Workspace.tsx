import Box from '@mui/material/Box'
import { PathData } from './TmpPathList'
import FolderNode from '@/core/FolderNode'
import Folder from './Folder'

const Workspace = (props: {
  paths: PathData[]
  node: FolderNode | null
  selectedPath: string
  onSelectedPathChange?: (path: string) => void
}) => {
  const { node, onSelectedPathChange } = props

  return (
    <Box
      sx={{
        color: 'white',
      }}
    >
      {`Workspace >`}
      <Box ml={2}>
        {node && (
          <Folder onSelectedPathChange={onSelectedPathChange} node={node} />
        )}
      </Box>
    </Box>
  )
}

export default Workspace
