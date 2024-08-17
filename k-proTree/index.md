---
category: Components
type: 通用
title: Tree
subtitle: 树形控件
---

1. 基于 Ant Design Vue [Tree](https://antdv.com/components/tree-cn/#Tree-) 封装
2. 支持 Ant Design Vue [Tree](https://antdv.com/components/tree-cn/#Tree-) 的所有属性、方法、插槽

## API

**只列举做出变动的部分**

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| expand-node | 是否展开节点,为布尔值时可理解为是否展开全部节点，区别于 'defaultExpandAll',请求后也可以自动展开 | boolean \| ((dataNode: DataNode) => boolean) | true |  |  |
| ... | 支持直接传递 [useRequest](/components/request-cn) 的所有属性 | - | - | - |
