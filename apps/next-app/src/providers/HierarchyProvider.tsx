import { useMemo, createContext, ReactNode } from 'react'

import FolderNode from '@/core/FolderNode'
import { Post } from '@/types'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const useSelectedPost = (
  postState: RootState['posts'],
  selectedPath: string,
  workspaceTree: FolderNode
) => {
  return useMemo(() => {
    let selectedPost: Post | null = null
    let selectedNode: FolderNode | null = null

    let relativePosts: Post[] = postState.ids.map(
      (id) => postState.itemById[id]
    )

    const relativePostIds: string[] = []

    const collectPost = (startNode: FolderNode) => {
      if (startNode.id !== '' && postState.itemById[startNode.id]) {
        relativePostIds.push(startNode.id)
      }

      if (!startNode) {
        return [selectedNode, postState]
      }

      ;[...Object.values(startNode.children)].forEach((childNode) => {
        collectPost(childNode)
      })
    }

    if (selectedPath === '') {
      selectedNode = workspaceTree
    } else if (selectedPath === '/') {
      selectedNode = workspaceTree.children['/']
    } else {
      selectedNode = workspaceTree.children['/'].find(selectedPath)

      if (selectedNode) {
        collectPost(selectedNode)
        selectedPost = postState.itemById[selectedNode.id]
      }

      relativePosts = relativePostIds.map((id) => postState.itemById[id])
    }

    return {
      selectedPost,
      selectedNode,
      relativePosts,
      relativePostIds,
    }
  }, [selectedPath, postState, workspaceTree])
}

const usePathTree = (posts: Post[]) => {
  return useMemo(() => {
    const tmpPaths: Post[] = []
    const workspacePaths: Post[] = []
    const workspaceTree = new FolderNode()

    posts.forEach((post) => {
      if (!post.path) {
        tmpPaths.push(post)
      } else {
        workspacePaths.push(post)

        const strs = post.path.split('/').map((str) => `/${str}`)

        let current = workspaceTree

        strs.forEach((str, index) => {
          if (!current.children[str]) {
            if (index === strs.length - 1) {
              current = current.createChildNode(str, post.id, post)
            } else {
              current = current.createChildNode(str)
            }
          } else {
            current = current.children[str]

            if (index === strs.length - 1) {
              current.id = post.id
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
  }, [posts])
}

export interface HierarchyContextValue {
  tmpPaths: Post[]
  workspacePaths: Post[]
  workspaceTree: FolderNode | null
  selectedPath: string
  selectedPost: Post | null
  selectedNode: FolderNode | null
  relativePosts: Post[]
  relativePostIds: string[]
}

const defaultHierarchyContextValue = {
  tmpPaths: [],
  workspacePaths: [],
  workspaceTree: null,
  selectedPath: '',
  selectedPost: null,
  selectedNode: null,
  relativePosts: [],
  relativePostIds: [],
}

export const HierarchyContext = createContext<HierarchyContextValue>(
  defaultHierarchyContextValue
)

const HierarchyProvider = (props: { children: ReactNode }) => {
  const { children } = props

  const postState = useSelector((state: RootState) => state.posts)

  const posts = postState.ids.map((id) => postState.itemById[id])

  const selectedPath = useSelector(
    (state: RootState) => state.global.selectedPath
  )

  const { tmpPaths, workspacePaths, workspaceTree } = usePathTree(posts)

  const { selectedPost, selectedNode, relativePosts, relativePostIds } =
    useSelectedPost(postState, selectedPath, workspaceTree)

  return (
    <HierarchyContext.Provider
      value={{
        tmpPaths,
        workspacePaths,
        workspaceTree,
        selectedPath,
        selectedPost,
        selectedNode,
        relativePosts,
        relativePostIds,
      }}
    >
      {children}
    </HierarchyContext.Provider>
  )
}

export default HierarchyProvider
