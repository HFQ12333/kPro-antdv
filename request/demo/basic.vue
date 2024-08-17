<docs>
---
  order: 1
  title:
    zh-CN: 基础用法
---
</docs>

<script setup lang="ts">
// 实际开发中,直接从 '@kg/ui' 导入即可
import { useRequest } from "../index.ts";

function delay(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("success");
    }, time);
  });
}

// 模拟接口
async function getUserInfo(requestError: boolean) {
  await delay(1500);
  if (requestError) throw new Error("123");
  return { name: "胡富强", age: 18, t: +new Date() };
}

const { reload, data } = useRequest({
  request: getUserInfo,
  immediate: false,
});
</script>

<template>
  <ASpace>
    <KProButton type="primary" @click="() => reload()">
      请求用户信息
    </KProButton>
    <KProButton type="primary" @click="() => reload(true)">
      请求失败
    </KProButton>
  </ASpace>
  <br />
  <br />
  {{ JSON.stringify(data, null, 2) }}
</template>
