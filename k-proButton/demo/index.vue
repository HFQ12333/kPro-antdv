<script lang="ts">
import { defineComponent } from 'vue'
import CN from '../index.md'

import Icon from './icon.vue'
import Async from './async.vue'

export default defineComponent({
  CN,
  components: {
    Icon,
    Async,
  },
  setup() {
    return {}
  },
})
</script>

<template>
  <demo-sort>
    <Icon />
    <Async />
  </demo-sort>
</template>
