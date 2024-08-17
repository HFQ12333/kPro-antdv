import type { AnyFn } from '@vueuse/core'

type ScrollTo = (
  { key, align, offset }: { key: string | number; align?: 'top' | 'bottom' | 'auto'; offset?: number }
) => void

export interface KProTreeInst {
  reload: AnyFn
  scrollTo: ScrollTo
}
