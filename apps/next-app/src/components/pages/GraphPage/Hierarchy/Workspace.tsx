import { useDispatch } from 'react-redux'
import Box from '@mui/material/Box'
import { SvgIcon } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import FolderNode from '@/core/FolderNode'
import AddFileSvg from '@/images/add-file.svg'
import DeleteSvg from '@/images/delete.svg'
import RefreshSvg from '@/images/refresh.svg'
import { selectPath, creatingFile } from '@/redux/features/global/globalSlice'
import useHierarchy from '@/hooks/useHierarchy'
import { setPosts } from '@/redux/features/posts/postSlice'
import api from '@/lib/api'
import { Post } from '@/types'
import Folder from './Folder'

const Workspace = (props: {
  node: FolderNode | null
  onSelectedPathChange?: (path: string) => void
}) => {
  const { node, onSelectedPathChange } = props

  const { selectedNode } = useHierarchy()
  const dispatch = useDispatch()

  const handleCreatingFile = () => {
    dispatch(creatingFile())
  }

  const handleRefresh = async () => {
    let posts: Post[]

    try {
      const response = await api.listPosts({})

      posts = response.data
    } catch (error) {
      console.error(error)
      posts = []
    }

    const ids: string[] = []
    const itemById: Record<string, Post> = {}

    posts.forEach((post) => {
      ids.push(post.id)
      itemById[post.id] = post
    })

    dispatch(setPosts({ ids, itemById }))
  }

  const handleDeleteFile = async () => {
    try {
      await api.deletePost(selectedNode?.data?.id)
      dispatch(selectPath('/'))
    } catch (error) {
      console.error(error)
    }

    await handleRefresh()
  }

  return (
    <Box
      sx={{
        color: 'white',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            fontSize: '20px',
            fontWeight: 'bold',
          }}
        >{`Workspace`}</Box>
        <Box>
          <IconButton sx={{ p: 0.25 }} onClick={handleCreatingFile}>
            <SvgIcon
              component={AddFileSvg}
              sx={{ width: '20px', height: '20px', color: 'white' }}
            ></SvgIcon>
          </IconButton>
          <IconButton sx={{ p: 0.25 }} onClick={handleDeleteFile}>
            <SvgIcon
              component={DeleteSvg}
              sx={{
                width: '20px',
                height: '20px',
                color: 'white',
                opacity: selectedNode?.data ? 1 : 0.5,
              }}
            ></SvgIcon>
          </IconButton>
          <IconButton sx={{ p: 0.25 }} onClick={handleRefresh}>
            <SvgIcon
              component={RefreshSvg}
              sx={{ width: '20px', height: '20px', color: 'white' }}
            ></SvgIcon>
          </IconButton>
        </Box>
      </Box>
      <Box>
        {node && (
          <Folder
            isRoot
            onSelectedPathChange={onSelectedPathChange}
            node={node}
          />
        )}
      </Box>
    </Box>
  )
}

export default Workspace
