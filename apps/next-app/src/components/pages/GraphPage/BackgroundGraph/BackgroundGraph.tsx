import { useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'
import * as d3 from 'd3'
import { RootState } from '@/redux/store'
import { Post } from '@/redux/features/posts/postSlice'
import { Tag } from '@/redux/features/tags/tagSlice'

interface PostNodeData {
  index?: number
  id: number
  x: number
  y: number
  type: 'post' | 'tag'
  data: Post
}
interface TagNodeData {
  index?: number
  id: number
  x: number
  y: number
  type: 'post' | 'tag'
  data: Tag
}

type NodeData = PostNodeData | TagNodeData

const renderGraph = (
  element: HTMLElement,
  posts: RootState['posts'],
  tags: RootState['tags']
) => {
  const width = 1440
  const height = 900
  const viewWidth = width * 1.5
  const viewHeight = height * 1.5
  const circleRadius = 45

  const tagNodeIdBytagId = new Map<string, number>()

  const postNodeData: PostNodeData[] = posts.ids.map((id, index) => {
    const post = posts.itemById[id]

    return {
      id: index,
      x: 0,
      y: 0,
      type: 'post',
      data: post,
    }
  })

  const tagNodeData: TagNodeData[] = tags.ids.map((id, index) => {
    const tag = tags.itemById[id]
    const nodeId = index + posts.ids.length

    tagNodeIdBytagId.set(id, nodeId)
    return {
      id: nodeId,
      x: 0,
      y: 0,
      type: 'tag',
      data: tag,
    }
  })

  const nodeDatas: NodeData[] = [...postNodeData, ...tagNodeData]

  const linkDatas = postNodeData.reduce<{ source: number; target: number }[]>(
    (acc, node) => {
      node.data.tag_ids.forEach((tagId) => {
        const tagNodeId = tagNodeIdBytagId.get(tagId.toString())

        if (tagNodeId !== undefined) {
          acc.push({
            source: tagNodeId,
            target: node.id,
          })
        }
      })
      return acc
    },
    []
  )

  const svg = d3
    .select(element)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr(
      'viewBox',
      `${-viewWidth / 2} ${-viewHeight / 2} ${viewWidth} ${viewHeight}`
    )

  const links = svg
    .append('g')
    .selectAll('line')
    .data(linkDatas)
    .join('line')
    .style('stroke', '#ffffff') as unknown as d3.Selection<
    SVGLineElement | d3.BaseType,
    {
      source: { id: number; x: number; y: number }
      target: { id: number; x: number; y: number }
    },
    SVGGElement,
    unknown
  >

  const nodes = svg
    .append('g')
    .selectAll('g')
    .data(nodeDatas)
    .join('g')
    .attr('transform', (node) => `translate(${node.x},${node.y})`)

  nodes
    .append('circle')
    .attr('r', circleRadius)
    .attr('fill', '#afafaf')
    .attr('cx', 0)
    .attr('cy', 0)

  nodes
    .append('text')
    .attr('x', 0)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('y', 0)
    .style('fill', '#ffffff')
    .text((node) => node.data.name)

  const forceNode = d3.forceManyBody().strength(6)

  const forceLink = d3
    .forceLink<NodeData, { source: number; target: number }>(linkDatas)
    .id((node: NodeData) => node.id)
    .strength(0)

  d3.forceSimulation<NodeData>(nodeDatas)
    .force('x', d3.forceX().strength(0.02))
    .force('y', d3.forceY().strength(0.04))
    .force('center', d3.forceCenter(0, 0))
    .force('charge', forceNode)
    .force('collide', d3.forceCollide().strength(1).radius(120).iterations(0.2))
    .force('link', forceLink)
    .on('tick', () => {
      nodes.attr('transform', (node) => `translate(${node.x},${node.y})`)

      links
        .attr('x1', (link: { source: { x: number; y: number } }) => {
          return link.source.x
        })
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y)
    })
}

const BackgroundGraph = (props: { posts: RootState['posts'] }) => {
  const { posts } = props
  const tags = useSelector((state: RootState) => state.tags)
  const rootRef = useRef<HTMLDivElement>()

  const refCallback = useCallback(
    (element: HTMLDivElement) => {
      if (!rootRef.current) {
        rootRef.current = element
      }

      rootRef.current.innerHTML = ''

      renderGraph(element, posts, tags)
    },
    [posts.ids]
  )

  return <div ref={refCallback}></div>
}

export default BackgroundGraph
