<script lang="tsx">
import { isFunction, isString, omit } from 'lodash-es'
import { Button } from 'ant-design-vue'
import { Icon } from '@iconify/vue'
import { hasOwn } from '@vueuse/core'
import { useLoading } from './hooks/useLoading'
import type { KProButtonInst, KProButtonProps, KProButtonSlotsType } from '.'
import { kProButtonProps } from '.'

export default defineComponent({
  name: 'KProButton',
  inheritAttrs: false,
  props: kProButtonProps,
  slots: Object as KProButtonSlotsType,
  setup(props, { attrs, slots, expose }) {
    const { loading, setLoading } = useLoading(props)
    const buttonInst = ref<KProButtonInst>()

    const getButtonProps = computed<KProButtonProps>(() => {
      return {
        ...attrs,
        ...omit(props, 'icon'),
        ref: buttonInst,
        loading: toValue(loading),
        onClick,
      }
    })

    const getButtonSlots = computed(() => {
      const hasIconProperty = isString(props.icon) && props.icon.length > 0
      if (!hasIconProperty)
        return slots
      return {
        ...slots,
        icon: () => {
          if (hasOwn(slots, 'icon'))
            return slots.icon()
          // 这个 class 是 ant-design-vue 中内置的,没有可以显示获取该 token 的 hook，所以这里写死
          // 这个 class 作用: 和 text 有一定间隙
          return <Icon icon={props.icon!} inline={true} class={'anticon'} />
        },
      }
    })

    function onClick(event: MouseEvent) {
      const clickEvent = props.onClick
      if (!isFunction(clickEvent))
        return
      const p = clickEvent(event) as any
      if (p instanceof Promise && props.autoLoading) {
        setLoading(true)
        p.finally(() => setLoading(false))
      }
    }

    expose({
      blur: () => buttonInst.value?.blur(),
      focus: () => buttonInst.value?.focus(),
    } as KProButtonInst)

    return {
      getButtonProps,
      getButtonSlots,
    }
  },
  render() {
    const { getButtonProps, getButtonSlots } = this

    return <Button {...getButtonProps} v-slots={getButtonSlots}></Button>
  },
})
</script>
