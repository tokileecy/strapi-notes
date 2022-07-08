import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setTags, Tag } from '@/redux/features/tags/tagSlice'
import { setPosts, Post } from '@/redux/features/posts/postSlice'
import {
  clearTags,
  removeTags,
  addTags,
} from '@/redux/features/global/globalSlice'
import api from '@/lib/api'
import BackgroundGraph from '@/components/pages/GraphPage/BackgroundGraph'
import Layout from '../../Layout'
import PostCard from './PostCard'
import TagsBlock from './TagsBlock'

interface PathData {
  name: string
  path: string
  id: string
}

class FolderNode {
  path: string
  absolutePath: string
  children: Record<string, FolderNode>
  parent: FolderNode | null
  id: string
  constructor(
    path = '',
    absolutePath = '',
    parent: FolderNode | null = null,
    id = ''
  ) {
    this.path = path
    this.id = id
    this.absolutePath = absolutePath
    this.children = {}
    this.parent = parent
  }

  createChildNode = (path: string, id?: string) => {
    const absolutePath = this.path === '/' ? path : `${this.path}${path}`
    const child = new FolderNode(path, absolutePath, this, id)

    this.children[path] = child

    return child
  }

  find = (path: string): FolderNode | null => {
    if (path === '' || path === '/') return this

    const strs = path.split(/\//)
    const [, next, ...rest] = strs

    const nextNode = this.children[`/${next}`]

    if (strs.length === 2 && nextNode) {
      return nextNode
    }

    if (nextNode) {
      return nextNode.find(`/${rest.join('/')}`)
    }

    return null
  }
}

export interface GraphPageProps {
  tags: Tag[]
  paths: PathData[]
}

const TagList = (props: { tags: Tag[] }) => {
  const { tags } = props

  return (
    <Box
      sx={{
        color: 'white',
      }}
    >
      <Box>{`Tags >`}</Box>
      <Box ml={2}>
        {tags.map((tag) => {
          return <Box key={tag.id}>{tag.name}</Box>
        })}
      </Box>
    </Box>
  )
}

const TmpPathList = (props: { paths: PathData[] }) => {
  const { paths } = props

  return (
    <Box
      sx={{
        color: 'white',
      }}
    >
      <Box>{`Tmp >`}</Box>
      <Box ml={2}>
        {paths.map((path) => {
          return <Box key={path.name}>{path.name}</Box>
        })}
      </Box>
    </Box>
  )
}

const FolderStateContext = createContext<{
  pathState: Record<string, { selected: boolean }>
  onPathChange?: (path: string) => void
}>({ pathState: {} })

const Folder = (props: { node: FolderNode }) => {
  const { node } = props
  const { pathState, onPathChange } = useContext(FolderStateContext)
  const childrens = Array.from(Object.values(node.children))

  const selected = useMemo(() => {
    return pathState[node.absolutePath]?.selected ?? false
  }, [pathState[node.absolutePath]])

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
          onPathChange?.(node.absolutePath)
        }}
      >
        {node.path}
      </Box>
      <Box ml={2}>
        {childrens.map((children, index) => {
          return <Folder key={children.path + index} node={children} />
        })}
      </Box>
    </Box>
  )
}

const Workspace = (props: {
  paths: PathData[]
  node: FolderNode
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
        <Box ml={2}>
          <Folder node={node} />
        </Box>
      </FolderStateContext.Provider>
    </Box>
  )
}

const GraphPage = (props: GraphPageProps): JSX.Element => {
  const { tags, paths } = props
  const dispatch = useDispatch()

  const selectedTags = useSelector(
    (state: RootState) => state.global.selectedTags
  )

  const { tmpPaths, workspacePaths, workspaceTree } = useMemo(() => {
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

  useEffect(() => {
    const tagIds: string[] = []
    const tagItemById: Record<string, Tag> = {}

    tags.forEach((tag) => {
      tagIds.push(tag.id.toString())
      tagItemById[tag.id] = tag
    })

    dispatch(setTags({ ids: tagIds, itemById: tagItemById }))
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const posts: Post[] = await api.getCustomPosts(
        Array.from(Object.keys(selectedTags))
      )

      const ids: string[] = []
      const itemById: Record<string, Post> = {}

      posts.forEach((post) => {
        ids.push(post.id)
        itemById[post.id] = post
      })

      dispatch(setPosts({ ids, itemById }))
    }

    fetchData()
  }, [selectedTags])

  const allPosts = useSelector((state: RootState) => state.posts)

  const [selectedPath, setSelectedPath] = useState('')

  const handleSelectedPathChange = (path: string) => {
    setSelectedPath(path)
  }

  const [selectedNode, collectedPosts] = useMemo(() => {
    if (selectedPath === '') return [workspaceTree, allPosts]
    if (selectedPath === '/') return [workspaceTree.children['/'], allPosts]

    const node = workspaceTree.children['/'].find(selectedPath)
    const nextPostIds: string[] = []

    const collectPost = (startNode: FolderNode) => {
      startNode.id !== '' && nextPostIds.push(startNode.id)
      if (!startNode) return [node, allPosts]
      ;[...Object.values(startNode.children)].forEach((childNode) => {
        collectPost(childNode)
      })
    }

    if (node) {
      collectPost(node)
    }

    return [
      node,
      nextPostIds.reduce<{
        ids: string[]
        itemById: Record<string, Post>
      }>(
        (acc, id) => {
          const collectPost = allPosts.itemById[Number(id)]

          if (collectPost) {
            acc.ids.push(id)
            acc.itemById[id] = allPosts.itemById[Number(id)]
          }

          return acc
        },
        { ids: [], itemById: {} }
      ),
    ]
  }, [selectedPath, allPosts])

  const allTags = useSelector((state: RootState) => state.tags)

  const selectedPost = useMemo(() => {
    if (selectedNode) {
      return allPosts.itemById[Number(selectedNode.id)]
    }
  }, [selectedNode, allPosts])

  const collectedTags = useMemo(() => {
    const targetSelectTags = [...Object.entries(selectedTags)].reduce<
      RootState['tags']
    >(
      (acc, tagEntry) => {
        if (tagEntry[1]) {
          acc.ids.push(tagEntry[0])
          acc.itemById[tagEntry[0]] = allTags.itemById[tagEntry[0]]
        }

        return acc
      },
      {
        ids: [],
        itemById: {},
      }
    )

    if (targetSelectTags.ids.length === 0) {
      return allTags
    } else {
      return targetSelectTags
    }
  }, [selectedTags, allTags])

  return (
    <Layout>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '300px',
            zIndex: 2,
            left: 0,
            p: 2,
            m: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(15, 108, 176, 0.24)',
          }}
        >
          <TmpPathList paths={tmpPaths} />
          <Workspace
            paths={workspacePaths}
            node={workspaceTree}
            selectedPath={selectedPath}
            onSelectedPathChange={handleSelectedPathChange}
          />
          <TagList tags={tags} />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            zIndex: 2,
            top: 0,
            left: '50%',
            transform: 'translateX(-70%)',
            p: 2,
            m: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(15, 108, 176, 0.24)',
          }}
        >
          <TagsBlock
            selectedTags={selectedTags}
            onAllSelected={() => {
              dispatch(clearTags())
            }}
            onTagSelected={(isSelected, id) => {
              if (isSelected) {
                dispatch(removeTags([id]))
              } else {
                dispatch(addTags([id]))
              }
            }}
          />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            zIndex: 2,
            right: 0,
            height: '100%',
            p: 2,
          }}
        >
          {selectedPost && <PostCard post={selectedPost} />}
        </Box>
        <Box
          sx={{
            position: 'absolute',
            zIndex: 0,
            height: '100%',
          }}
        >
          <BackgroundGraph tags={collectedTags} posts={collectedPosts} />
        </Box>
      </Box>
    </Layout>
  )
}

export default GraphPage
