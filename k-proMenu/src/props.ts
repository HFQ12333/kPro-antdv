import type {
  SubMenuProps,
  MenuItemProps,
} from 'ant-design-vue'
import type { AnyFn } from '@vueuse/core'
import type { ExtractPropTypes, PropType, Ref } from 'vue'
import { menuProps } from 'ant-design-vue/es/menu/src/Menu'
import { subMenuProps } from 'ant-design-vue/es/menu/src/SubMenu'
import { menuItemProps } from 'ant-design-vue/es/menu/src/MenuItem'

/**
 * @description 使用antdv导出的props，会导致所有的props没有提示
 * @see menuDividerProps
 */
// const menuDividerProps = {
//   prefixCls: String, //todo
//   dashed: Boolean,
// };

export const customKProMenuProps = {
  /**
  * @description 菜单初始值
  * @default []
  * @example 初始为一个空数组, :menuList="[]"
  */
  menuList: { //todo 命名，otions则与tabs重复，layout怎么传？
    type: Array as PropType<MenuListProps[]>,
    default: []
  },
  /** 
   * @description 更新菜单
   */
  "onUpdate:menuList": {
    type: Function as PropType<(item: MenuListProps) => void>
  },
  "onMenuItemClick": {
    type: Function as PropType<(item: MenuListProps) => void>,
    default: () => ({})
  },
  expandItem: {
    type: [Boolean, Function] as PropType<boolean | (() => boolean)>,
    default: true,
  },
}

export const kProRequestProps = {
  /**
   * @description 用于请求数据的函数
   */
  request: {
    type: Function as AnyFn,
  },
  /**
   * @description 是否初始化调用一次
   * @default true
   */
  immediate: {
    type: Boolean,
    default: true,
  },
  /**
   * @description request 函数调用结束后触发的回调函数,可以再此函数中处理最终要返回的值
   * @description 会被表单控件包装重写
   */
  convertValue: {
    type: Function as PropType<(value: any) => any>,
  },
  /**
   * @description 请求失败触发的回调函数
   * @param error 错误原因
   */
  onRequestError: {
    type: Function as PropType<(error: unknown) => void>,
  },
  /**
   * @description 请求成功触发的回调函数
   * @param value 请求成功拿到的数据
   */
  onRequestSuccess: {
    type: Function as PropType<(value: any) => void>,
  },
  /**
   * @description 请求失败后提示的错误消息,默认值可以在 KProConfigProvider 中统一注入错误消息格式
   * @default '数据请求失败,请稍后重试'
   * @example requestErrorTipMessage: '我是自定义错误消息提示~'
   * @example requestErrorTipMessage: (error) => error.message
   */
  requestErrorTipMessage: {
    type: [String, Function] as PropType<string | ((error: unknown) => string)>,
  },
  /**
   * @description 请求成功后提示的错误消息,默认值可以在 KProConfigProvider 中统一注入错误消息格式
   * @default undefined
   * @example requestSuccessTipMessage: '我是自定义成功消息提示~'
   * @example requestSuccessTipMessage: (data) => data.message
   */
  requestSuccessTipMessage: {
    type: [String, Function] as PropType<string | ((data: any) => string)>,
  },
  /**
   * @description 初始值,如果请求失败也会将数据置为初始值
   * @default undefined
   * @example 初始为一个数组, :requestInitialValue="[]"
   */
  requestInitialValue: {
    type: [] as PropType<any>,
  },
} as const

export const kProMenuProps = {
  ...menuProps(),
  ...subMenuProps(),
  ...menuItemProps(),
  ...customKProMenuProps,
  ...kProRequestProps,
}

export interface UseRequestReturn {
  reload: AnyFn
  loading: Ref<boolean>
  menuList: Ref<any>
  error: Ref<unknown>
}

export type SubMenuAndMenuItemProps = SubMenuProps & MenuItemProps

export interface MenuListProps extends SubMenuAndMenuItemProps {
  key: string
  label?: string
  tab?: string,
  path?: string
  frameSrc?: string
  groupTitle?: string
  closable?: boolean,
  showTabs?: boolean,
  children?: MenuListProps[]
}

export type KProMenuProps = ExtractPropTypes<typeof kProMenuProps>

export type KProRequestProps = ExtractPropTypes<typeof kProRequestProps>

export interface KProMenuInstance {
  reload: AnyFn
}