import {
  FocusEventHandler,
  KeyboardEventHandler,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { SvgIcon } from '@mui/material'
import Box from '@mui/material/Box'
import { RootState } from '@/redux/store'
import FolderNode from '@/core/FolderNode'
import FileSvg from '@/images/file.svg'
import api from '@/lib/api'
import { stopCreatingFile } from '@/redux/features/global/globalSlice'
import { setPosts } from '@/redux/features/posts/postSlice'
import { Post } from '@/types'

export interface FolderProps {
  isRoot?: boolean
  node: FolderNode
  onSelectedPathChange?: (path: string) => void
}

const Folder = (props: FolderProps) => {
  const { isRoot, node, onSelectedPathChange } = props

  const textareaRef = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()

  const pathStatus = useSelector(
    (state: RootState) => state.global.pathStatus[node.absolutePath]
  )

  const handleBlur: FocusEventHandler<HTMLInputElement> = async () => {
    dispatch(stopCreatingFile())
  }

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = async (e) => {
    if (e.key === 'Enter') {
      const fileName = textareaRef.current?.value

      try {
        await api.createPost({
          path: `${
            node.absolutePath === '/' ? '' : node.absolutePath
          }/${fileName}`,
          name: fileName,
          content: '',
        })

        dispatch(stopCreatingFile())

        let posts: Post[]

        try {
          const response = await api.listPosts({})

          posts = response.data
        } catch (error) {
          posts = []
        }

        const ids: string[] = []
        const itemById: Record<string, Post> = {}

        posts.forEach((post) => {
          ids.push(post.id)
          itemById[post.id] = post
        })

        dispatch(setPosts({ ids, itemById }))
      } catch (error) {
        return []
      }
    } else if (e.key === 'Escape') {
      dispatch(stopCreatingFile())
    }
  }

  const subFolders = useMemo(() => {
    return (
      <Box ml={isRoot ? 0 : 3}>
        {!isRoot && pathStatus?.isCreating && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
            onKeyDown={handleKeyDown}
          >
            <SvgIcon
              sx={{
                color: 'white',
                fontSize: '20px',
              }}
              component={FileSvg}
            />
            <Box
              ref={textareaRef}
              component="input"
              sx={{
                'ml': '4px',
                'backgroundColor': '#5B5B5B',
                'border': '1px solid #1AACFE',
                'fontSize': '12px',
                'lineHeight': '1.75em',
                'pl': '4px',
                'color': 'white',
                'width': '100%',
                'outline': 'none',
              }}
              defaultValue=""
              onBlur={handleBlur}
            />
          </Box>
        )}
        {node.childrenPaths.map((path, index) => {
          const childNode = node.childrenByPath[path]

          return (
            <Folder
              key={path + index}
              node={childNode}
              onSelectedPathChange={onSelectedPathChange}
            />
          )
        })}
      </Box>
    )
  }, [node, pathStatus])

  useEffect(() => {
    if (pathStatus?.isCreating) {
      textareaRef.current?.focus()
    }
  }, [pathStatus])

  return (
    <Box
      sx={{
        'color': 'white',
      }}
    >
      <Box
        sx={{
          'backgroundColor': pathStatus?.selected ? 'gray' : 'initial',
          '&:hover': {
            cursor: 'pointer',
            backgroundColor: 'gray',
          },
        }}
        onClick={() => {
          onSelectedPathChange?.(node.absolutePath)
        }}
      >
        {node.path !== '/' ? node.path.replace(/\//g, '') : '/'}
      </Box>
      {subFolders}
    </Box>
  )
}

export default Folder
