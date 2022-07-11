import { useCallback, useRef } from 'react'
import { Post } from '@/types'
import { Tag } from '@/redux/features/tags/tagSlice'
import { Box } from '@mui/material'
import renderGraph from './renderGraph'

interface BackgroundGraphProps {
  posts: Post[]
  tags: Tag[]
}

const BackgroundGraph = (props: BackgroundGraphProps) => {
  const { tags, posts } = props

  const rootRef = useRef<HTMLDivElement>()

  const refCallback = useCallback(
    (element: HTMLDivElement) => {
      if (!rootRef.current) {
        rootRef.current = element
      }

      rootRef.current.innerHTML = ''

      renderGraph(element, posts, tags)
    },
    [posts]
  )

  return (
    <Box
      ref={refCallback}
      sx={{
        height: '100%',
      }}
    ></Box>
  )
}

export default BackgroundGraph
