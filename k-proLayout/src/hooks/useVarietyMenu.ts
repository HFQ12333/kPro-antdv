import { Ref, computed, ref, } from 'vue'
import { filterMenusOrKeys } from './filterMenusOrKeys'
import type { Key, MenuListProps } from '@kg/components'
import { deepCopy } from '../../../../utils'

export const useVarietyMenu = (menuList: Ref<MenuListProps[] | undefined>, selectedKeysValue: Ref<(string | number)[] | undefined>) => {

  const getTopVarietyMenus = computed(() => {
    if (!menuList.value?.length) return []
    const copyMenuList = deepCopy(menuList.value)
    const topMenus = []
    for (let i of copyMenuList) {
      if (i?.children) {
        delete i.children
      }
      topMenus.push(i)
    }
    return topMenus
  })

  const getSiderVarietyMenus = computed(() => {
    if (!menuList.value?.length) return
    return filterMenusOrKeys(menuList.value, selectedKeysValue?.value?.[selectedKeysValue.value?.length - 1] as string)[0]?.children
  })

  return {
    getTopVarietyMenus,
    getSiderVarietyMenus,
  }
}