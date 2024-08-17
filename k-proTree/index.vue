<script lang="tsx">
import type { TreeProps } from 'ant-design-vue'
import { Spin, Tree } from 'ant-design-vue'
import { get, isBoolean, isFunction, isNumber, isString, merge, pick } from 'lodash-es'
import { treeProps } from 'ant-design-vue/es/tree/Tree'
import type { DataNode } from 'ant-design-vue/es/tree'
import { useRequest } from '../request'
import { _useVModel } from '../vModel'
import { traverse } from '../utils/traverse'
import type { KProTreeInst, KProTreeSlotsType } from '.'
import { kProTreeProps } from '.'

export default defineComponent({
  name: 'KProTree',
  inheritAttrs: false,
  props: kProTreeProps,
  slots: Object as KProTreeSlotsType,
  setup(props, { attrs, expose }) {
    const treeInst = ref<KProTreeInst>()

    const treeData = _useVModel(props, 'treeData', undefined, {
      passive: true,
      defaultValue: [],
      shouldEmit: () => false,
    })

    const expandedKeys = _useVModel(props, 'expandedKeys', undefined, {
      passive: true,
      defaultValue: [],
    })

    const fullNodeKeys = computed(() => {
      const data = toValue(treeData) as DataNode[]
      const keys: (string | number)[] = []
      const fieldNameKey = get(props.fieldNames, 'key', 'key')

      traverse(
        data,
        (node) => {
          if (isString(node[fieldNameKey]) || isNumber(node[fieldNameKey]))
            keys.push(node[fieldNameKey])
        },
        { childrenField: get(props.fieldNames, 'children', 'children') },
      )

      return keys
    })

    const { reload, loading } = useRequest({
      ...props,
      requestInitialValue: [],
      onRequestSuccess: (value) => {
        treeData.value = props.convertValue ? props.convertValue({ value: toValue(treeData), requestValue: value }) : value
        props.onRequestSuccess?.(value)
        doUpdateExpandKeysByExpandNodeProp()
      },
    })

    function doUpdateExpandKeysByExpandNodeProp() {
      const { expandNode } = props

      if (isBoolean(expandNode)) {
        doUpdateExpandedKeys(expandNode ? fullNodeKeys.value : [])
        return
      }

      if (isFunction(expandNode)) {
        const data = toValue(treeData) as DataNode[]
        const keys: (string | number)[] = []
        const fieldNameKey = get(props.fieldNames, 'key', 'key')

        traverse(
          data,
          (node) => {
            if (expandNode(node))
              keys.push(node[fieldNameKey])
          },
          { childrenField: get(props.fieldNames, 'children', 'children') },
        )
        doUpdateExpandedKeys(keys)
      }
    }

    function doUpdateExpandedKeys(keys: (string | number)[]) {
      expandedKeys.value = keys
    }

    const getTreeProps = computed<TreeProps>(() => {
      const defaultStyle = {
        'min-height': '200px',
      }
      return {
        ...merge({ style: defaultStyle }, attrs),
        ...pick(props, Object.keys(treeProps())),
        'treeData': toValue(treeData),
        'expandedKeys': toValue(expandedKeys),
        'onUpdate:expandedKeys': doUpdateExpandedKeys,
      }
    })

    expose({
      reload,
      scrollTo: (info: any) => treeInst.value?.scrollTo(info),
    } as KProTreeInst)

    return {
      loading,
      getTreeProps,
    }
  },
  render() {
    const {
      $slots,
      loading,
      getTreeProps,
    } = this

    return (<Spin spinning={loading}>
      <Tree {...getTreeProps} v-slots={$slots} />
    </Spin>)
  },
})
</script>
