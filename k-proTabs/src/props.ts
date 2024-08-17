import { AnyFn } from '@vueuse/core';
import { tabsProps } from 'ant-design-vue/es/tabs/src/Tabs'
import { KProTabPane } from './types';
import type { ExtractPropTypes, PropType } from 'vue'

export const kProTabsRequestProps = {
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

export const kProTabsProps = {
  ...tabsProps(),
  ...kProTabsRequestProps,
  /**
   * @description 配置 tabpane，推荐使用 request 生成
   */
  "options": {
    type: Array as PropType<(string | number | KProTabPane)[]>,
    default: () => []
  },
}

export type KProTabsProps = Partial<ExtractPropTypes<typeof kProTabsProps>>
