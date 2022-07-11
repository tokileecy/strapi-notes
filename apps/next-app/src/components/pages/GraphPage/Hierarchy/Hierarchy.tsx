import useHierarchy from '@/hooks/useHierarchy'

import Workspace from './Workspace'

const Hierarchy = () => {
  const { workspaceTree, handleSelectedPathChange } = useHierarchy()

  return (
    <>
      <Workspace
        node={workspaceTree}
        onSelectedPathChange={handleSelectedPathChange}
      />
    </>
  )
}

export default Hierarchy
