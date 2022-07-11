import { useEffect, useMemo, useState } from 'react'
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
import FolderNode from './FolderNode'
import TagList from './TagList'
import TmpPathList, { PathData } from './TmpPathList'
import Workspace from './Workspace'
import usePathTree from './usePathTree'

export interface GraphPageProps {
  tags: Tag[]
  paths: PathData[]
}

const GraphPage = (props: GraphPageProps): JSX.Element => {
  const { tags, paths } = props
  const dispatch = useDispatch()

  const allPosts = useSelector((state: RootState) => state.posts)
  const allTags = useSelector((state: RootState) => state.tags)

  const selectedTags = useSelector(
    (state: RootState) => state.global.selectedTags
  )

  const { tmpPaths, workspacePaths, workspaceTree } = usePathTree(paths)

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
