import type { ExtractPropTypes, PropType } from 'vue'
import { treeProps } from 'ant-design-vue/es/tree/Tree'
import type { DataNode } from 'ant-design-vue/es/tree'
import { kProRequestProps } from '../request'

export const kProTreeProps = {
  ...treeProps(),
  ...kProRequestProps,
  /**
   * @description 是否展开节点,为布尔值时可理解为是否展开全部节点，区别于 'defaultExpandAll',请求后也可以自动展开
   * @example :expand-node="false" 收起所有节点
   * @example :expand-node="true" 展开所有节点
   * @example :expand-node="node => node.key.include('someKey')" 展开特定的节点
   * @default true
   */
  expandNode: {
    type: [Boolean, Function] as PropType<boolean | ((dataNode: DataNode) => boolean)>,
    default: true,
  },
  convertValue: {
    type: Function as PropType<({ value, requestValue }: { value: any; requestValue: any }) => DataNode[]>,
  },
} as const

export type KProTreeProps = Partial<ExtractPropTypes<typeof kProTreeProps>>
