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
  childrenPaths: string[]
  childrenByPath: Record<string, FolderNode>
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
    this.childrenPaths = []
    this.childrenByPath = {}
    this.parent = parent
    this.data = data
  }

  createChildNode = (path: string, id = '', data?: Post) => {
    const absolutePath =
      this.path === '/' ? path : `${this.absolutePath}${path}`

    const child = new FolderNode({ path, absolutePath, parent: this, id, data })

    this.childrenPaths.push(path)
    this.childrenPaths.sort()
    this.childrenByPath[path] = child

    return child
  }

  find = (path: string): FolderNode | null => {
    if (path === '' || path === '/') return this

    const strs = path.split(/\//)
    const [, next, ...rest] = strs

    const nextNode = this.childrenByPath[`/${next}`]

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
