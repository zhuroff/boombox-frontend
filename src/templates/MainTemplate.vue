<template>

<div class="container">
  <AppSidebar />
  <main class="main">
    <Header />
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </main>
  <Player />
  <Snackbar />
</div>

</template>

<script lang="ts">

import { defineComponent, computed } from 'vue'
import AppSidebar from '~/components/AppSidebar.vue'
import Header from '~/components/Header/Header.vue'
import Player from '~/components/Player/Player.vue'
import Snackbar from '~/components/Snackbar/Snackbar.vue'

export default defineComponent({
  components: {
    AppSidebar,
    Header,
    Player,
    Snackbar
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
