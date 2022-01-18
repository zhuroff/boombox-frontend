<template>

<div class="container">
  <AppSidebar />
  <main class="main">
    <AppHeader />
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </main>
  <!-- <AppPlayer /> -->
</div>

</template>

<script lang="ts">

import { defineComponent } from 'vue'
import AppSidebar from '~/components/AppSidebar.vue'
import AppHeader from '~/components/AppHeader.vue'
// import AppPlayer from '~/components/AppPlayer.vue'

export default defineComponent({
  components: {
    AppSidebar,
    AppHeader,
    // AppPlayer
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';

.container {
  height: 100vh;
  display: flex;
  overflow: hidden;
  position: relative;
  max-width: $containerWidth;
  margin: 0 auto;
  background-color: $white;
}

.main {
  flex: none;
  position: relative;
  overflow: hidden;
  width: calc(100% - #{$asideWidth});
}

</style>
