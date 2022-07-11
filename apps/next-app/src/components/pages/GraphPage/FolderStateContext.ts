import { createContext } from 'react'

const FolderStateContext = createContext<{
  pathState: Record<string, { selected: boolean }>
  onPathChange?: (path: string) => void
}>({ pathState: {} })

export default FolderStateContext
