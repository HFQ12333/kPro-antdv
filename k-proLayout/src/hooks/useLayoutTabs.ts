import { computed, ref, watch, watchEffect, getCurrentInstance, onUnmounted } from 'vue'
import { useGo } from './useGo'
import type { Ref } from 'vue'
import { filterMenusOrKeys } from './filterMenusOrKeys';
import { useStorage, useVModel } from '@vueuse/core';
import { merge, includes, uniqBy, remove } from 'lodash-es'
import { TabPaneProps } from 'ant-design-vue';
import type { KProLayoutProps, MenuListProps } from '@kg/components';

interface LayoutTabsProps {
  selectedKeys: Ref<(string | number)[] | undefined>;
  openIFrameUrl: Ref<string | undefined>;
  activeKey: Ref<string | undefined>;
  doUpdateActiveKey: (key: string) => void
  openKeys: Ref<(string | number)[] | undefined>
  menuList: Ref<MenuListProps[]>
  panes: Ref<TabPaneProps[]>
  doUpdatePanes: (item: MenuListProps) => void
  cache: Ref<boolean>
}

function findMenuItemByKey(array: any, key: string | undefined) {
  if (array?.length > 0) {
    for (let i of array) {
      if (i.key === key) {
        return i
      }
      if (i?.children) {
        const result: any = findMenuItemByKey(i.children, key);
        if (result) {
          return result;
        }
      }
    }
  }
  return ''
}

export const useLayoutTabs = (props, options: LayoutTabsProps) => {

  const {
    selectedKeys,
    openIFrameUrl,
    activeKey,
    doUpdateActiveKey,
    openKeys,
    menuList,
    panes,
    doUpdatePanes,
    cache
  } = options

  const go = useGo()

  // 每次保持文件uid都会变
  const instance = getCurrentInstance()

  const storageType = props.storageType === 'sessionStorage' ? sessionStorage : localStorage

  const storePanes = useStorage<MenuListProps[]>(`storeOpenTabs`, [], storageType);
  const storeSelectedKeys = useStorage<(string | number)[]>(`storeSelectedKeys`, [], storageType);
  const storeOpenKeys = useStorage<(string | number)[]>(`storeOpenKeys`, [], storageType);

  const tempSetPanes = ref([])

  const clearStorage = () => {
    storePanes.value = null
    storeSelectedKeys.value = null
    storeOpenKeys.value = null
  }

  // 用户传了selectedKeys,openKeys但缓存有则走缓存，缓存没有则走用户传递的
  watch(menuList, () => {
    if (cache.value) {
      if (storeSelectedKeys.value?.length > 0) {
        selectedKeys.value = storeSelectedKeys.value
      }
      if (storeOpenKeys.value?.length > 0) {
        openKeys.value = storeOpenKeys.value
      }
    }
  }, { immediate: true })

  // 监听selectedKeys改变激激活的tab & 设置展示的panes，同时监听menulist，可能接口返回的，一开始没有值
  watch([menuList, selectedKeys], ([menus, keys]) => {
    if (menus?.length === 0 || !keys) return
    // 根据选中的key更新标签页激活的key
    const lastKey = keys?.[keys.length - 1]
    doUpdateActiveKey(lastKey as string)
    // 更新标签页展示的tab与缓存中的tab
    updatePanes(lastKey as string)
  })

  // 设置selectedKeys,openKeys缓存
  watch([menuList, selectedKeys, openKeys], ([, newSelectedKeys, newOpenKeys]) => {
    const filteredKeys = filterMenusOrKeys(menuList.value, newSelectedKeys?.[newSelectedKeys?.length - 1] as string, true)
    if (cache.value) {
      storeSelectedKeys.value = filteredKeys
      storeOpenKeys.value = newOpenKeys
    } else {
      storeSelectedKeys.value = null
      storeOpenKeys.value = null
    }
  }, { immediate: true })

  watch(() => activeKey.value, key => {
    console.log(key, 'activeKey!!');
    // 没有激活的key
    if (!key) {
      selectedKeys.value = []
      openKeys.value = []
      go('/')
    } else {
      // 进行路由跳转
      const item = findMenuItemByKey(menuList.value, key)
      console.log(item, 'item');
      const { path, frameSrc } = item
      frameSrc ? openIFrameUrl.value = frameSrc : openIFrameUrl.value = ''
      path && go(path)
      // 若选中的tab不等于激活的tab，则进行tab切换，即更新selectedKeys与openKeys
      if (key !== selectedKeys.value?.[selectedKeys.value.length - 1]) {
        const filteredKeys = filterMenusOrKeys(menuList.value, key, true)
        selectedKeys.value = filteredKeys
        openKeys.value = filteredKeys
      }
    }
  }
  )

  function updatePanes(key: string) {
    const item = findMenuItemByKey(menuList.value, key)
    if (!item?.children) {
      if (cache.value && item.showTabs) {
        const allCheckedPanes = [...storePanes.value, item]
        const uniqPanes = uniqBy(allCheckedPanes, 'key')
        doUpdatePanes(uniqPanes)
        storePanes.value = panes.value
      } else if (item.showTabs) {
        tempSetPanes.value.push(item)
        const uniqPanes = uniqBy(tempSetPanes.value, 'key')
        doUpdatePanes(uniqPanes)
      }
    }
  }

  function handleEdit(mayBeKeyOrEvent: unknown) {
    if (typeof mayBeKeyOrEvent === "string") {
      const key = mayBeKeyOrEvent
      if (!cache.value) {
        removePanesByKey(tempSetPanes.value, key)
      } else {
        removePanesByKey(storePanes.value, key)
      }
    }
  }

  function removePanesByKey(panesParam, key) {
    remove(panesParam, item => item.key === key)
    panesParam = uniqBy(panesParam, 'key')
    doUpdatePanes(panesParam)
    if (key === activeKey.value) {
      for (let i = panesParam.length - 1; i >= 0; i--) {
        if (!panesParam[i].disabled) { // 禁用则不激活
          doUpdateActiveKey(panesParam[i].key)
          continue;
        }
      }
    }
    if (panesParam.length === 0) {
      doUpdateActiveKey('')
    }
  }

  return {
    handleEdit,
    clearStorage,
  }
}