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

export default FolderNode
