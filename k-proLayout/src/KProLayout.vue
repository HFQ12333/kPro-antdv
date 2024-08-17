<script lang="tsx">
import { kProLayoutProps } from "./props";
import { pick } from "../../../utils";
import { useVarietyMenu } from "./hooks/useVarietyMenu";
import { useLayoutTabs } from "./hooks/useLayoutTabs";
import { Icon } from "@iconify/vue";
import KProIFrame from "./KProIFrame.vue";
import { filterMenusOrKeys } from "./hooks/filterMenusOrKeys";
import type { LayoutProps, SiderProps } from "ant-design-vue";
import { useFullscreen, useVModel } from "@vueuse/core";
import { deepCopy } from "../../../utils";
import { defineComponent, computed, ref, watch, toRef, unref } from "vue";
import { basicProps } from "ant-design-vue/es/layout/layout";
import {
  KProMenu,
  kProMenuProps,
  KProTabs,
  kProTabsProps,
} from "@kg/components";
import type {
  KProIFrameProps,
  KProLayoutInstance,
  KProMenuInstance,
  KProMenuProps,
  KProTabsProps,
  MenuListProps,
  KProTabInstance,
} from "@kg/components";
import {
  Layout,
  LayoutSider,
  LayoutHeader,
  LayoutContent,
} from "ant-design-vue";

export default defineComponent({
  name: "KProLayout",
  props: kProLayoutProps,
  inheritAttrs: false,
  setup(props, { expose }) {
    const openIFrameUrl = ref("");

    const layoutMenuInstance = ref<KProMenuInstance>();

    const layoutTabInstance = ref<KProTabInstance>();

    const { toggle, isFullscreen } = useFullscreen();

    const immediate = ref(props.immediate);

    // menuList
    const menuList = useVModel(props, "menuList", undefined, {
      passive: true,
    });
    function onUpdateMenuList(menus: MenuListProps[]) {
      menuList.value = menus;
    }

    // selectedKeys
    const selectedKeys = useVModel(props, "selectedKeys", undefined, {
      passive: true,
    });
    function onUpdateSelectedKeys(keys: string[]) {
      if (props.layoutMode === "mixed") {
        const filteredKeys = filterMenusOrKeys(
          menuList.value,
          keys[keys.length - 1],
          true
        );
        console.log(filteredKeys, "哈哈哈");
        selectedKeys.value = filteredKeys;
      } else {
        selectedKeys.value = keys;
      }
    }

    // openKeys
    const openKeys = useVModel(props, "openKeys", undefined, {
      passive: true,
    });
    function onUpdateOpenKeys(keys: string[]) {
      openKeys.value = keys;
    }

    // activeKey
    const activeKey = useVModel(props, "activeKey", undefined, {
      passive: true,
    });
    function doUpdateActiveKey(keys: string) {
      activeKey.value = keys;
    }

    // panes
    const panes = useVModel(props, "panes", undefined, {
      passive: true,
    });
    function doUpdatePanes(item) {
      panes.value = item;
    }

    const { handleEdit, clearStorage } = useLayoutTabs(props, {
      selectedKeys,
      openIFrameUrl,
      activeKey,
      doUpdateActiveKey,
      openKeys,
      menuList,
      panes,
      doUpdatePanes,
      cache: toRef(props, "cache"),
    });

    const { getTopVarietyMenus, getSiderVarietyMenus } = useVarietyMenu(
      menuList,
      selectedKeys
    );

    const getKProLayoutProps = computed(() => {
      const klayoutProps = pick(props, Object.keys(Layout.props));
      return {
        ...klayoutProps,
      };
    });

    const getKProLayoutSiderProps = computed(() => {
      const klayoutSiderProps = pick(props, [
        ...(Object.keys(LayoutSider.props) as (keyof SiderProps)[]),
      ]);
      return {
        ...klayoutSiderProps,
      };
    });

    function normalizeMenuList(menuList: MenuListProps[]) {
      const copiedMenuList = deepCopy(menuList);
      const recursionMenus = (menu: MenuListProps[]) => {
        for (const i of menu) {
          if (i.closable === undefined) {
            i.closable = true;
          }
          if (i.children?.length === 0) {
            delete i.children;
          }
          if (i.label) {
            i.tab = i.label;
          }
          if (i.showTabs === undefined) {
            i.showTabs = true;
          }
          if (i.children && i.children.length > 0) {
            recursionMenus(i.children);
          }
        }
        return menu;
      };
      const getRecursionMenus = recursionMenus(copiedMenuList);
      return getRecursionMenus;
    }

    watch(
      () => props.layoutMode,
      () => {
        immediate.value = false;
      }
    );

    const getKProMenuProps = computed(() => {
      const menuProps = pick(
        props,
        Object.keys(kProMenuProps) as (keyof KProMenuProps)[]
      );
      return {
        ...menuProps,
        menuList: menuList.value,
        "onUpdate:menuList": onUpdateMenuList,
        mode: "inline",
        convertValue: normalizeMenuList,
        openKeys: openKeys.value,
        "onUpdate:openKeys": onUpdateOpenKeys,
        selectedKeys: selectedKeys.value,
        "onUpdate:selectedKeys": onUpdateSelectedKeys,
        ref: layoutMenuInstance,
        immediate: immediate.value,
      };
    });

    const getKProTabsProps = computed(() => {
      const tabsProps = pick(
        props,
        Object.keys(kProTabsProps) as (keyof KProTabsProps)[]
      );
      return {
        ...tabsProps,
        hideAdd: true,
        type: "editable-card",
        activeKey: activeKey.value,
        "onUpdate:activeKey": doUpdateActiveKey,
        panes: panes.value,
        "onUpdate:panes": doUpdatePanes,
        onEdit: handleEdit,
        ref: layoutTabInstance,
      };
    });

    const getKProMenuVarietyTopProps = computed(() => {
      const menuProps = pick(
        props,
        Object.keys(kProMenuProps) as (keyof KProMenuProps)[]
      );
      return {
        ...menuProps,
        selectedKeys: selectedKeys.value,
        "onUpdate:selectedKeys": onUpdateSelectedKeys,
        mode: "horizontal",
        menuList: getTopVarietyMenus.value,
        "onUpdate:menuList": onUpdateMenuList,
        convertValue: normalizeMenuList,
        openKeys: openKeys.value,
        "onUpdate:openKeys": onUpdateOpenKeys,
        ref: layoutMenuInstance,
        immediate: immediate.value,
      };
    });

    const getKProMenuVarietySiderProps = computed(() => {
      const menuProps = pick(
        props,
        Object.keys(kProMenuProps) as (keyof KProMenuProps)[]
      );
      return {
        ...menuProps,
        selectedKeys: selectedKeys.value,
        "onUpdate:selectedKeys": onUpdateSelectedKeys,
        menuList: getSiderVarietyMenus.value,
        openKeys: openKeys.value,
        "onUpdate:openKeys": onUpdateOpenKeys,
        mode: "inline",
        convertValue: normalizeMenuList,
        immediate: false,
      };
    });

    const getKProIFrameProps = computed<KProIFrameProps>(() => {
      return {
        frameUrl: openIFrameUrl.value,
        onIframeLoadFail: props.onIframeLoadFail,
      };
    });

    const exposeMethods: KProLayoutInstance = {
      getKProMenuInstance: () => unref(layoutMenuInstance),
      getKProTabsInstance: () => unref(layoutTabInstance),
      clearStorage,
    };

    expose(exposeMethods);

    return {
      isFullscreen,
      toggle,
      layoutMode: toRef(props, "layoutMode"),
      getKProLayoutProps,
      getKProLayoutSiderProps,
      getKProMenuProps,
      getKProTabsProps,
      getKProIFrameProps,
      getKProMenuVarietyTopProps,
      getSiderVarietyMenus,
      getKProMenuVarietySiderProps,
    };
  },
  render() {
    const {
      $slots,
      isFullscreen,
      toggle,
      layoutMode,
      getKProLayoutProps,
      getKProLayoutSiderProps,
      getKProMenuProps,
      getKProTabsProps,
      getKProIFrameProps,
      getKProMenuVarietyTopProps,
      getSiderVarietyMenus,
      getKProMenuVarietySiderProps,
    } = this;

    const renderTabsRightExtra = () => {
      return (
        <div onClick={toggle}>
          <Icon
            icon={
              isFullscreen ? "tdesign:fullscreen-exit" : "gridicons:fullscreen"
            }
          />
        </div>
      );
    };

    const renderVarietyTheme = () => {
      return (
        <Layout {...getKProLayoutProps}>
          <LayoutHeader>
            <KProMenu {...getKProMenuVarietyTopProps}></KProMenu>
          </LayoutHeader>
          <Layout>
            {getSiderVarietyMenus?.length > 0 && (
              <LayoutSider {...getKProLayoutSiderProps}>
                <KProMenu {...getKProMenuVarietySiderProps}></KProMenu>
              </LayoutSider>
            )}
            <LayoutContent>
              <div class="py-5px px-10px">
                <KProTabs
                  {...getKProTabsProps}
                  v-slots={{
                    rightExtra: renderTabsRightExtra,
                  }}
                ></KProTabs>
              </div>
              <div class="px-10px pt-0px pb-20px overflow-y-scroll h-[calc(100vh-135px)]">
                <KProIFrame {...getKProIFrameProps} />
                {$slots.default?.()}
              </div>
            </LayoutContent>
          </Layout>
        </Layout>
      );
    };

    const renderNormalTheme = () => {
      return (
        <Layout {...getKProLayoutProps}>
          <LayoutSider {...getKProLayoutSiderProps}>
            <KProMenu {...getKProMenuProps}></KProMenu>
          </LayoutSider>
          <Layout>
            <div class="py-5px px-10px">
              <KProTabs
                {...getKProTabsProps}
                v-slots={{
                  rightExtra: renderTabsRightExtra,
                }}
              ></KProTabs>
            </div>
            <LayoutContent>
              <div class="px-10px pt-0px pb-20px overflow-y-scroll h-[calc(100vh-56px)]">
                <KProIFrame {...getKProIFrameProps} />
                {$slots.default?.()}
              </div>
            </LayoutContent>
          </Layout>
        </Layout>
      );
    };

    const renderCustomTheme = () => {
      return (
        <Layout class="h-screen" {...getKProLayoutProps}>
          {$slots.default?.()}
        </Layout>
      );
    };

    if (!layoutMode) {
      return renderCustomTheme();
    } else if (layoutMode === "normal") {
      return renderNormalTheme();
    } else if (layoutMode === "mixed") {
      return renderVarietyTheme();
    }
  },
});
</script>

<style scoped>
:deep(.ant-tabs-nav) {
  height: 40px;
}
:deep(.ant-layout-header) {
  padding: 0;
}
</style>
./hooks/useGo
