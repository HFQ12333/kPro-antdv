<script lang="tsx">
import { KProIFrameProps, kProIFrameProps } from "./props";
import { defineComponent, ref, watch } from "vue";
import { useToggle } from "@vueuse/core";
import { Spin } from "ant-design-vue";

export default defineComponent({
  name: "KProIFrame",
  props: kProIFrameProps,
  setup(props: KProIFrameProps) {
    const loading = ref(true);

    const toggleLoading = useToggle(loading);

    function onLoad() {
      toggleLoading(false);
      const iFrameDom = document.querySelector("iframe");
      if (iFrameDom?.childNodes.length === 0) {
        props["onIframeLoadFail"]?.();
      }
    }

    watch(
      () => props.frameUrl,
      () => {
        toggleLoading(true);
      }
    );

    return {
      onLoad,
      loading,
    };
  },
  render() {
    const { frameUrl, onLoad, loading } = this;

    const renderLoading = () => {
      return loading ? (
        <Spin size="large" class="h-screen flex justify-center items-center" />
      ) : null;
    };

    const renderIframe = () => {
      return (
        <div>
          {renderLoading()}
          <iframe onLoad={onLoad} src={frameUrl} class="h-screen w-screen" />
        </div>
      );
    };

    return frameUrl ? renderIframe() : null;
  },
});
</script>
