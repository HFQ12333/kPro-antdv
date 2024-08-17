import { get, set } from 'lodash-es'

interface TraverseOptions<T extends object> {
  /**
   * @description 子节点的名称
   * @default 'children'
   */
  childrenField?: keyof T
}

export function traverse<T extends object>(
  data: T[],
  callback: (item: T, index: number) => void,
  options: TraverseOptions<T> = {},
): T[] {
  const { childrenField = 'children' } = options

  return data.map((item, index) => {
    const children = get(item, childrenField, [])
    callback(item, index)
    if (children && children.length > 0)
      set(item, childrenField, traverse(children, callback, options))
    return item
  })
}
