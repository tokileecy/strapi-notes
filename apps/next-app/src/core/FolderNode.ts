import { Post } from '@/types'

export interface FolderNodeOptions {
  path?: string
  absolutePath?: string
  parent?: FolderNode | null
  data?: Post
  id?: string
}

class FolderNode {
  path: string
  absolutePath: string
  children: Record<string, FolderNode>
  parent: FolderNode | null
  data: Post | null
  id: string

  constructor(options: FolderNodeOptions = {}) {
    const {
      path = '',
      absolutePath = '',
      id = '',
      parent = null,
      data = null,
    } = options

    this.path = path
    this.id = id
    this.absolutePath = absolutePath
    this.children = {}
    this.parent = parent
    this.data = data
  }

  createChildNode = (path: string, id = '', data?: Post) => {
    const absolutePath = this.path === '/' ? path : `${this.path}${path}`
    const child = new FolderNode({ path, absolutePath, parent: this, id, data })

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

export default FolderNode
