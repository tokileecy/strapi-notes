import { useState } from 'react'
import Box from '@mui/material/Box'
import { PathData } from './TmpPathList'
import FolderNode from '@/core/FolderNode'
import FolderStateContext from './FolderStateContext'
import Folder from './Folder'

const Workspace = (props: {
  paths: PathData[]
  node: FolderNode | null
  selectedPath: string
  onSelectedPathChange: (path: string) => void
}) => {
  const { node, paths, selectedPath, onSelectedPathChange } = props

  const [pathState, setPathState] = useState<
    Record<string, { selected: boolean }>
  >(
    paths.reduce<Record<string, { selected: boolean }>>((acc, path) => {
      acc[path.path] = { selected: false }
      return acc
    }, {})
  )

  const handleSelectedPathChange = (path: string) => {
    setPathState((prev) => {
      const next = { ...prev }

      next[selectedPath] = { selected: false }
      next[path] = { selected: true }

      return next
    })
    onSelectedPathChange(path)
  }

  return (
    <Box
      sx={{
        color: 'white',
      }}
    >
      {`Workspace >`}
      <FolderStateContext.Provider
        value={{ pathState, onPathChange: handleSelectedPathChange }}
      >
        <Box ml={2}>{node && <Folder node={node} />}</Box>
      </FolderStateContext.Provider>
    </Box>
  )
}

export default Workspace
