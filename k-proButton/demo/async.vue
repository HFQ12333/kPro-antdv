<docs>
---
  order: 1
  title:
    zh-CN: 自动 loading
---

## zh-CN

当检测到事件为异步时,会自动 loading
</docs>

<script setup lang="ts">
function delay(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('success')
    }, time)
  })
}

async function submit() {
  await delay(2000)
}
</script>

<template>
  <KProButton type="primary" @click="submit">
    提交
  </KProButton>
</template>
