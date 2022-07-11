import { useMemo, createContext, ReactNode, useCallback, useRef } from 'react'

import FolderNode from '@/core/FolderNode'
import { Post, Tag } from '@/types'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { selectPath } from '@/redux/features/global/globalSlice'

const usePathTree = (posts: Post[]) => {
  return useMemo(() => {
    const uncategorizedPaths: Post[] = []
    const workspacePaths: Post[] = []
    const workspaceTree = new FolderNode()

    posts.forEach((post) => {
      if (!post.path) {
        uncategorizedPaths.push(post)
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
      uncategorizedPaths,
      workspacePaths,
      workspaceTree,
    }
  }, [posts])
}

const useSelectedPost = (
  postState: RootState['posts'],
  tagState: RootState['tags'],
  selectedTagSet: Record<string, boolean>,
  selectedPath: string,
  workspaceTree: FolderNode
) => {
  const postsByTagId = useMemo(() => {
    const map = tagState.ids.reduce<Record<string, Set<Post>>>((acc, id) => {
      acc[id] = new Set()
      return acc
    }, {})

    postState.ids.forEach((id) => {
      const post = postState.itemById[id]

      if (post.tag_ids)
        post.tag_ids.forEach((tagId) => {
          map[tagId].add(post)
        })
    })
    return map
  }, [postState, tagState])

  const filteredPostSet = useMemo(() => {
    const selectedTagIds = [...Object.keys(selectedTagSet)]

    if (selectedTagIds.length === 0) {
      return new Set([...Object.values(postState.itemById)])
    }

    const posts = selectedTagIds.reduce<Post[]>((acc, id) => {
      return [...acc, ...postsByTagId[id].values()]
    }, [])

    return new Set(posts)
  }, [postsByTagId, selectedTagSet])

  return useMemo(() => {
    let selectedPost: Post | null = null
    let selectedNode: FolderNode | null = null

    let relativePosts: Post[] = [...filteredPostSet.values()]

    const relativePostIds: string[] = []
    let relativeTagIdSet: Set<string> = new Set([])

    const collectPost = (startNode: FolderNode) => {
      if (
        startNode.id !== '' &&
        filteredPostSet.has(postState.itemById[startNode.id])
      ) {
        relativePostIds.push(startNode.id)
      }

      if (startNode.data) {
        startNode.data.tag_ids?.forEach((id) => {
          relativeTagIdSet.add(id)
        })
      }

      if (!startNode) {
        return
      }

      ;[...Object.values(startNode.children)].forEach((childNode) => {
        collectPost(childNode)
      })
    }

    if (selectedPath === '') {
      relativeTagIdSet = new Set(tagState.ids)
      selectedNode = workspaceTree
    } else if (selectedPath === '/') {
      relativeTagIdSet = new Set(tagState.ids)
      selectedNode = workspaceTree.children['/']
    } else {
      selectedNode = workspaceTree.children['/'].find(selectedPath)

      if (selectedNode) {
        collectPost(selectedNode)
        selectedPost = postState.itemById[selectedNode.id]
      }

      relativePosts = relativePostIds.map((id) => postState.itemById[id])
    }

    const relativeTagIds = [...relativeTagIdSet.values()]

    const relativeTags = relativeTagIds.map((id) => tagState.itemById[id])

    const relativeSelectedTagIds = [...relativeTagIdSet.values()].reduce<
      string[]
    >((acc, id) => {
      if (relativeTagIdSet.has(id)) {
        if ([...Object.keys(selectedTagSet)].length === 0 || selectedTagSet[id])
          acc.push(id)
      }

      return acc
    }, [])

    const relativeSelectedTags = relativeSelectedTagIds.map(
      (id) => tagState.itemById[id]
    )

    return {
      selectedPost,
      selectedNode,
      relativePosts,
      relativePostIds,
      relativeTagIds,
      relativeTags,
      relativeSelectedTags,
      relativeSelectedTagIds,
    }
  }, [selectedPath, postState, workspaceTree, selectedTagSet, filteredPostSet])
}

export interface HierarchyContextValue {
  uncategorizedPaths: Post[]
  workspacePaths: Post[]
  workspaceTree: FolderNode | null
  selectedPath: string
  selectedPost: Post | null
  selectedNode: FolderNode | null
  relativePosts: Post[]
  relativePostIds: string[]
  relativeTagIds: string[]
  relativeTags: Tag[]
  relativeSelectedTagIds: string[]
  relativeSelectedTags: Tag[]
  handleSelectedPathChange?: (path: string) => void
}

const defaultHierarchyContextValue = {
  uncategorizedPaths: [],
  workspacePaths: [],
  workspaceTree: null,
  selectedPath: '',
  selectedPost: null,
  selectedNode: null,
  relativePosts: [],
  relativePostIds: [],
  relativeTags: [],
  relativeTagIds: [],
  relativeSelectedTags: [],
  relativeSelectedTagIds: [],
  handleSelectedPathChange: undefined,
}

export const HierarchyContext = createContext<HierarchyContextValue>(
  defaultHierarchyContextValue
)

const HierarchyProvider = (props: { children: ReactNode }) => {
  const { children } = props
  const dispatch = useDispatch()

  const postState = useSelector((state: RootState) => state.posts)
  const tagState = useSelector((state: RootState) => state.tags)

  const selectedTagSet = useSelector(
    (state: RootState) => state.global.selectedTagSet
  )

  const posts = useMemo(
    () => postState.ids.map((id) => postState.itemById[id]),
    [postState.ids]
  )

  const selectedPath = useSelector(
    (state: RootState) => state.global.selectedPath
  )

  const { uncategorizedPaths, workspacePaths, workspaceTree } =
    usePathTree(posts)

  const {
    selectedPost,
    selectedNode,
    relativePosts,
    relativePostIds,
    relativeTagIds,
    relativeTags,
    relativeSelectedTags,
    relativeSelectedTagIds,
  } = useSelectedPost(
    postState,
    tagState,
    selectedTagSet,
    selectedPath,
    workspaceTree
  )

  const handleSelectedPathChange = useCallback(
    (path: string) => {
      dispatch(selectPath(path))
    },
    [selectPath]
  )

  return (
    <HierarchyContext.Provider
      value={{
        uncategorizedPaths,
        workspacePaths,
        workspaceTree,
        selectedPath,
        selectedPost,
        selectedNode,
        relativePosts,
        relativePostIds,
        relativeTagIds,
        relativeTags,
        relativeSelectedTagIds,
        relativeSelectedTags,
        handleSelectedPathChange,
      }}
    >
      {children}
    </HierarchyContext.Provider>
  )
}

export default HierarchyProvider
