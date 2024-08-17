import type { SlotsType } from 'vue'

export interface KProTreeSlots {
  icon?: any
  title?: any
  switcherIcon?: any
  titleRender?: any
  default?: any
  leafIcon?: any
}

export type KProTreeSlotsType = SlotsType<KProTreeSlots>
