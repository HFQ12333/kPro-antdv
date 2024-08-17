import type { ExtractPropTypes, PropType, Ref } from 'vue'
import { KProMenuInstance, KProMenuProps, KProTabInstance, KProTabsProps, kProMenuProps, kProTabsProps } from '@kg/components'
import type { SiderProps } from 'ant-design-vue'
import { siderProps } from 'ant-design-vue/es/layout/Sider'
import { basicProps } from 'ant-design-vue/es/layout/layout'

export type StorageType = 'sessionStorage' | 'localStorage';

export const customKProLayoutProps = {
  layoutMode: {
    type: String as PropType<'normal' | 'mixed'>,
    default: 'normal'
  },
  breakpoint: {
    type: String as PropType<SiderProps["breakpoint"]>,
    default: 'sm'
  },
  collapsible: {
    type: Boolean,
    default: true
  },
  cache: {
    type: Boolean,
    default: true
  },
  "storageType": {
    type: String as PropType<StorageType>,
    default: 'sessionStorage'
  },
}

export const kProIFrameProps = {
  frameUrl: {
    type: String,
    default: ''
  },
  onIframeLoadFail: {
    type: Function as PropType<() => void>,
  }
}

export const kProLayoutProps = {
  ...basicProps(),
  ...siderProps(),
  ...customKProLayoutProps,
  ...kProMenuProps,
  ...kProIFrameProps,
  ...kProTabsProps,
}

export type KProLayoutProps = ExtractPropTypes<typeof kProLayoutProps> & KProMenuProps & KProTabsProps

export type KProIFrameProps = ExtractPropTypes<typeof kProIFrameProps>

export interface KProLayoutInstance {
  getKProMenuInstance: () => KProMenuInstance | undefined
  getKProTabsInstance: () => KProTabInstance | undefined
  clearStorage: () => void
}

export type Key = string 
