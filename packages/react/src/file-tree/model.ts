export type TreeItem = { path: string; name: string; parent: string | null; depth: number; directory: boolean }

// Preserve caller file paths in callbacks; directory keys end in a slash.
export function treeItems(paths: readonly string[]): TreeItem[] {
  const items = new Map<string, TreeItem>()
  for (const path of paths) {
    const parts = path.split('/')
    if (!path || parts.some(part => !part || part === '.' || part === '..')) continue
    let parent: string | null = null
    parts.forEach((name, depth) => {
      const directory = depth < parts.length - 1
      const key = parts.slice(0, depth + 1).join('/') + (directory ? '/' : '')
      items.set(key, { path: key, name, parent, depth, directory })
      parent = key
    })
  }
  const children = new Map<string | null, TreeItem[]>()
  for (const item of items.values()) {
    const siblings = children.get(item.parent) ?? []
    siblings.push(item)
    children.set(item.parent, siblings)
  }
  const result: TreeItem[] = []
  function visit(parent: string | null) {
    const siblings = children.get(parent) ?? []
    siblings.sort((a, b) => Number(b.directory) - Number(a.directory) || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    for (const item of siblings) { result.push(item); visit(item.path) }
  }
  visit(null)
  return result
}

export function visibleItems(items: TreeItem[], collapsed: ReadonlySet<string>) {
  const hidden = new Set<string>()
  return items.filter(item => {
    if (item.parent && (hidden.has(item.parent) || collapsed.has(item.parent))) {
      hidden.add(item.path)
      return false
    }
    return true
  })
}
