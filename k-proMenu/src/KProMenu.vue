<script lang="tsx">
import { Icon } from "@iconify/vue";
import { useRequest } from "../../useRequest";
import { pick } from "../../../utils";
import { Menu, SubMenu, MenuItem, MenuItemGroup, Spin } from "ant-design-vue";
import { kProMenuProps } from "./props";
import { defineComponent, computed, toValue } from "vue";
import type { MenuProps, SubMenuProps, MenuItemProps } from "ant-design-vue";
import type { MenuListProps } from "@kg/components";
import { useVModel } from "@vueuse/core";
import { KProMenuSlotsType } from "./slots";
import {
  get,
  isBoolean,
  isFunction,
  isNumber,
  isString,
  merge,
} from "lodash-es";

export default defineComponent({
  name: "KProMenu",
  inheritAttrs: false,
  props: kProMenuProps,
  slots: Object as KProMenuSlotsType,
  setup(props, { expose }) {
    const menuList = useVModel(props, "menuList", undefined, {
      passive: true,
    });

    const openKeys = useVModel(props, "openKeys", undefined, {
      passive: true,
    });

    function doUpdateOpenKeys(keys: (string | number)[]) {
      openKeys.value = keys;
    }

    const fullNodeKeys = computed(() => {
      const data = menuList.value;
      const keys: (string | number)[] = [];
      const menuNameKey = get(props.menuList, "key", "key");
      traverseMenuData(data, (item) => {
        if (isString(item[menuNameKey]) || isNumber(item[menuNameKey]))
          keys.push(item[menuNameKey]);
      });
      return keys;
    });

    const { reload, loading } = useRequest({
      ...props,
      onRequestSuccess: (value) => {
        menuList.value = value;
        props.onRequestSuccess?.(value);
        doUpdateExpandKeysByExpandNodeProp();
      },
    });

    function doUpdateExpandKeysByExpandNodeProp() {
      const { expandItem } = props;
      if (isBoolean(expandItem)) {
        doUpdateOpenKeys(expandItem ? fullNodeKeys.value : []);
        return;
      }
      if (isFunction(expandItem)) {
        const data = openKeys.value;
        const keys: (string | number)[] = [];
        const menuNameKey = get(props.menuList, "key", "key");
        traverseMenuData(data, (item) => {
          if (expandItem(item)) keys.push(item[menuNameKey]);
        });
        doUpdateOpenKeys(keys);
      }
    }

    function traverseMenuData<T extends any[]>(
      data: T,
      callback?: (item: MenuListProps) => void
    ) {
      const childrenKey = get(props.menuList, "children", "children");
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const children = item[childrenKey];
        const hasChildren = children && children.length > 0;
        callback?.(item);
        if (hasChildren) traverseMenuData(children, callback);
      }
    }

    const getKProMenuProps = computed(() => {
      const menuProps = pick(
        props,
        Object.keys(Menu.props) as (keyof MenuProps)[]
      );
      return {
        ...menuProps,
        openKeys: openKeys.value,
        "onUpdate:openKeys": doUpdateOpenKeys,
      };
    });

    const getKProSubMenuProps = computed(() => {
      const subMenuProps = pick(
        props,
        Object.keys(SubMenu.props) as (keyof SubMenuProps)[]
      );
      return {
        ...subMenuProps,
      };
    });

    const getKProMenuItemProps = computed(() => {
      const menuItemProps = pick(
        props,
        Object.keys(MenuItem.props) as (keyof MenuItemProps)[]
      );
      return {
        ...menuItemProps,
      };
    });

    expose({ reload });

    return {
      loading,
      menuList,
      getKProMenuProps,
      getKProMenuItemProps,
      getKProSubMenuProps,
      onMenuItemClick: props.onMenuItemClick,
    };
  },
  render() {
    const {
      $slots,
      loading,
      menuList,
      onMenuItemClick,
      getKProMenuProps,
      getKProMenuItemProps,
      getKProSubMenuProps,
    } = this;

    const renderMenu = (menus: MenuListProps[]) => {
      return menus.map((item) => {
        return item.children && item.children.length > 0 ? (
          <SubMenu
            {...getKProSubMenuProps}
            {...item}
            icon={item.icon && <Icon icon={item.icon} />}
            v-slots={{
              ...pick($slots, ["expandIcon"]),
              default: () => item.children && renderMenu(item.children),
            }}
          ></SubMenu>
        ) : (
          <>
            {item.groupTitle ? (
              <MenuItemGroup title={item.groupTitle}></MenuItemGroup>
            ) : (
              <MenuItem
                {...getKProMenuItemProps}
                {...item}
                icon={item.icon && <Icon icon={item.icon} />}
                onClick={() => onMenuItemClick?.(item)}
              >
                <span>{item.label}</span>
              </MenuItem>
            )}
          </>
        );
      });
    };

    return loading ? (
      <Spin size="large" class="h-screen flex justify-center items-center" />
    ) : (
      <Menu
        {...getKProMenuProps}
        v-slots={{
          ...pick($slots, ["overflowedIndicator", "default"]),
          default: () => renderMenu(menuList),
        }}
      ></Menu>
    );
  },
});
</script>
