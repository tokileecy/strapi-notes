import { useMemo } from 'react'
import { PathData } from './TmpPathList'
import FolderNode from './FolderNode'

const usePathTree = (paths: PathData[]) => {
  return useMemo(() => {
    const tmpPaths: PathData[] = []
    const workspacePaths: PathData[] = []
    const workspaceTree = new FolderNode('')

    paths.forEach((path) => {
      if (!path.path) {
        tmpPaths.push(path)
      } else {
        workspacePaths.push(path)

        const strs = path.path.split('/').map((str) => `/${str}`)

        let current = workspaceTree

        strs.forEach((str, index) => {
          if (!current.children[str]) {
            if (index === strs.length - 1) {
              current = current.createChildNode(str, path.id)
            } else {
              current = current.createChildNode(str)
            }
          } else {
            current = current.children[str]

            if (index === strs.length - 1) {
              current.id = path.id
            }
          }
        })
      }
    })
    return {
      tmpPaths,
      workspacePaths,
      workspaceTree,
    }
  }, [paths])
}

export default usePathTree
