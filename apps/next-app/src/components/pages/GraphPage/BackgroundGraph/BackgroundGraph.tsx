import { useCallback, useRef } from 'react'
import { Post, Tag } from '@/types'
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
        display: 'flex',
        justifyContent: 'center',
      }}
    ></Box>
  )
}

export default BackgroundGraph
