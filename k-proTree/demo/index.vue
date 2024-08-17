<script lang="ts">
import { defineComponent } from 'vue'
import CN from '../index.md'
import Reload from './reload.vue'
import Expand from './expand.vue'

export default defineComponent({
  CN,
  components: {
    Reload,
    Expand,
  },
  setup() {
    return {}
  },
})
</script>

<template>
  <demo-sort>
    <Reload />
    <Expand />
  </demo-sort>
</template>
