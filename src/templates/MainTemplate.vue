<template>

<div class="container">
  <Sidebar />
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
import Sidebar from '~/components/Sidebar/Sidebar.vue'
import Header from '~/components/Header/Header.vue'
import Player from '~/components/Player/Player.vue'
import Snackbar from '~/components/Snackbar/Snackbar.vue'

export default defineComponent({
  components: {
    Sidebar,
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
