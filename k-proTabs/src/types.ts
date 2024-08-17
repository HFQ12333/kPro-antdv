import type { TabPaneProps } from 'ant-design-vue'
import { AnyFn } from '@vueuse/core'

type TabPaneSlotKeys = 'default' | 'closeIcon'

export interface KProTabPane extends TabPaneProps {
  key?: string | number
  slots?: Partial<Record<TabPaneSlotKeys, AnyFn>>
}

