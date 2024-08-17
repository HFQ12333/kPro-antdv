import { Comment, Fragment, Text, type VNode } from 'vue'

// 从 ant-design-vue copy 过来的
function isEmptyElement(c: any) {
  return (
    c
    && (c.type === Comment
      || (c.type === Fragment && c.children.length === 0)
      || (c.type === Text && c.children.trim() === ''))
  )
}

// 从 ant-design-vue copy 过来的
export function filterEmptyVNode(children: VNode[]) {
  const res: VNode[] = []
  children.forEach((child) => {
    if (Array.isArray(child))
      res.push(...child)
    else if (child?.type === Fragment)
      res.push(...filterEmptyVNode((child.children ?? []) as VNode[]))
    else
      res.push(child)
  })
  return res.filter(c => !isEmptyElement(c))
}
