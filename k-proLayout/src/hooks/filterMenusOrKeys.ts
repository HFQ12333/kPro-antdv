import type { MenuListProps } from '@kg/components';
import { deepCopy } from '../../../../utils';

export const filterMenusOrKeys = (menuList: MenuListProps[], selectedKeys: string, isGetKeys = false) => {

  function traverse(data: MenuListProps[], parent: any, callback: (item: MenuListProps, parent: any) => void) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const children = item.children;
      const hasChildren = children && children.length > 0;
      callback && callback(item, parent);
      if (hasChildren) {
        item.children = traverse(children, item, callback);
      }
    }
    return data;
  }

  function flatTree2Map(data: MenuListProps[]) {
    const map = new Map();
    const copyData = deepCopy(data)
    traverse(copyData, null, (item: MenuListProps, parent: any) => {
      map.set(item.key, { ...item, parentPath: parent?.key ?? null });
    });
    return map;
  }

  function getMenusOrKeys(key: string, map: any, isGetKey: boolean) {
    const res = [];
    let currentMenu = map.get(key);
    while (currentMenu) {
      if (isGetKey) {
        res.unshift(currentMenu.key);
      } else {
        res.unshift(currentMenu);
      }
      currentMenu = map.get(currentMenu.parentPath);
    }
    return res;
  }

  const flatMap = flatTree2Map(menuList)
  return getMenusOrKeys(selectedKeys, flatMap, isGetKeys)
}