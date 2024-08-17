import type { SlotsType } from 'vue'

interface KProTabsSlots {
  tabBarExtraContent?: any;
  leftExtra?: any;
  rightExtra?: any;
  moreIcon?: any;
  addIcon?: any;
  removeIcon?: any;
  renderTabBar?: any;
}

export type KProTabsSlotsType = SlotsType<KProTabsSlots>
