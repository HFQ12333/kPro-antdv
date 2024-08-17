<docs>
---
  order: 1
  title:
    zh-CN: 手动加载
---

## zh-CN

`immediate` 为 `false` 初始化不执行远程请求,通过实例上的 `reload` 方法控制加载
</docs>

<script setup lang="ts">
import { ref } from 'vue'
import type { KProTreeInst } from '@kg/ui'
import type { TreeProps } from 'ant-design-vue'

const treeInst = ref<KProTreeInst>()

function delay(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('success')
    }, time)
  })
}

async function requestTreeData(): Promise<TreeProps['treeData']> {
  await delay(2000)
  return [
    {
      title: 'parent 1',
      key: '0-0',
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0',
          disabled: true,
          children: [
            { title: 'leaf', key: '0-0-0-0', disableCheckbox: true },
            { title: 'leaf', key: '0-0-0-1' },
          ],
        },
        {
          title: 'parent 1-1',
          key: '0-0-1',
          children: [{ key: '0-0-1-0', title: 'sss' }],
        },
      ],
    },
  ]
}
</script>

<template>
  <KProButton type="primary" @click="() => treeInst.reload()">
    加载数据
  </KProButton>
  <KProTree
    ref="treeInst"
    :immediate="false"
    :request="requestTreeData"
  />
</template>
