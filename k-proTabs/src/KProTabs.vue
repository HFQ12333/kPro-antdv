<script lang="tsx">
import { Tabs, TabPane, Spin } from "ant-design-vue";
import { defineComponent, computed, unref } from "vue";
import { get, pick, isString, isNumber } from "lodash-es";
import { useRequest } from "@kg/components/k-proMenu/src/hooks/useRequest";
import { useVModel } from "@vueuse/core";
import { tabsProps } from "ant-design-vue/es/tabs/src/Tabs";
import { kProTabsProps } from "./props";
import { KProTabsSlotsType } from "./slots";
import type { TabsProps } from "ant-design-vue";

export default defineComponent({
  name: "KProTabs",
  inheritAttrs: false,
  props: kProTabsProps,
  slots: Object as KProTabsSlotsType,
  setup(props, { attrs, expose }) {
    const options = useVModel(props, "options", undefined, {
      passive: true,
      defaultValue: [],
      shouldEmit: () => false,
    });

    const { reload, loading } = useRequest({
      ...props,
      onRequestSuccess: (value) => {
        options.value = value;
        props.onRequestSuccess?.(value);
      },
    });

    const getKProTabsProps = computed<TabsProps>(() => {
      return {
        ...attrs,
        ...pick(props, Object.keys(tabsProps())),
      };
    });

    const renderTabPane = () => {
      return unref(options).map((item, index) => {
        if (isString(item) || isNumber(item)) {
          item = { tab: String(item) };
        }
        const { slots = {}, ...rest } = item;
        return (
          <TabPane
            {...rest}
            key={get(item, "key", index)}
            v-slots={slots}
          ></TabPane>
        );
      });
    };

    expose({ reload });

    return {
      loading,
      renderTabPane,
      getKProTabsProps,
    };
  },
  render() {
    const { loading, renderTabPane, getKProTabsProps, $slots } = this;

    if (loading) {
      return <Spin spinning={loading}></Spin>;
    }

    return (
      <Tabs
        {...getKProTabsProps}
        v-slots={{
          ...$slots,
          default: renderTabPane,
        }}
      ></Tabs>
    );
  },
});
</script>
