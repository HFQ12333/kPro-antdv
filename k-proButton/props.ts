import buttonProps from 'ant-design-vue/es/button/buttonTypes'
import type { ExtractPropTypes } from 'vue'

export const kProButtonProps = {
  ...buttonProps(),
  /**
   * @description ant-design-vue 中 icon 只能使用插槽的形式，这里做一下扩展，可以使用字符串传递 icon 名称
   * @description 所有 icon 见下方链接
   * @link https://icon-sets.iconify.design/
   */
  icon: {
    type: String,
  },
  /**
   * @description 是否需要自动 loading
   * @default true
   */
  autoLoading: {
    type: Boolean,
    default: true,
  },
} as const

export type KProButtonProps = Partial<ExtractPropTypes<typeof kProButtonProps>>
