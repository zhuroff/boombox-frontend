<template>

<div class="container">
  <Sidebar />

  <main
    ref="main"
    class="main"
  >
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </main>

  <Player />
  <Snackbar />
</div>

</template>

<script lang="ts">

import { defineComponent, onMounted, ref } from 'vue'
import SimpleBar from 'simplebar'
import Sidebar from '~/components/Sidebar/Sidebar.vue'
import Player from '~/components/Player/Player.vue'
import Snackbar from '~/components/Snackbar/Snackbar.vue'

export default defineComponent({
  components: {
    Sidebar,
    Player,
    Snackbar
  },

  setup() {
    const main = ref(null)

    onMounted(() => {
      if (main.value) {
        new SimpleBar(main.value, { autoHide: false })
      }
    })

    return { main }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';
@import 'include-media';

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

  @include media('<laptop') {
    width: 100vw;
    height: 100vh;
  }

  @include media('>=laptop') {
    width: calc(100% - #{$asideWidth});
    height: calc(100vh - #{$playerHeight});
  }
}

</style>
