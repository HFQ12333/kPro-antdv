<script lang="ts">
import { defineComponent } from 'vue'
import CN from '../index.md'
import Basic from './basic.vue'

export default defineComponent({
  CN,
  components: {
    Basic,
  },
  setup() {
    return {}
  },
})
</script>

<template>
  <demo-sort :cols="1">
    <Basic />
  </demo-sort>
</template>
