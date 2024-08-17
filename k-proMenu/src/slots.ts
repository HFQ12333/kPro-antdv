import type { SlotsType } from 'vue'

interface KProMenuSlots {
  expandIcon?: { isOpen: boolean;[key: string]: any };
  overflowedIndicator?: any;
  default?: any;
}

export type KProMenuSlotsType = SlotsType<KProMenuSlots>
