import useHierarchy from '@/hooks/useHierarchy'
import TagList from './TagList'
import TmpPathList from './TmpPathList'
import Workspace from './Workspace'
import { Tag } from '@/types'

interface HierarchyProps {
  tags: Tag[]
}

const Hierarchy = (props: HierarchyProps) => {
  const { tags } = props

  const {
    tmpPaths,
    workspacePaths,
    workspaceTree,
    selectedPath,
    handleSelectedPathChange,
  } = useHierarchy()

  return (
    <>
      <TmpPathList paths={tmpPaths} />
      <Workspace
        paths={workspacePaths}
        node={workspaceTree}
        selectedPath={selectedPath}
        onSelectedPathChange={handleSelectedPathChange}
      />
      <TagList tags={tags} />
    </>
  )
}

export default Hierarchy
