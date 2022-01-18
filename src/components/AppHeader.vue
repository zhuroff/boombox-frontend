<template>
  <header class="header">
    <!-- <AppSearch />
    <AppSync /> -->
  </header>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
// import AppSearch from './AppSearch.vue'
// import AppSync from './AppSync.vue'

export default defineComponent({
  // components: {
  //   AppSearch,
  //   AppSync
  // }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';

.header {
  background-color: $white;
  border-bottom: 1px solid $border;
  height: $headerHeight;
  padding: 15px 24px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2000;

  &.--z-low {
    z-index: 0;
  }
}

</style>
