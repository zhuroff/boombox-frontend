<template>

<div class="container">
  <Sidebar
    :isExpanded="isNavOpened"
    @burgerClick="navHandler"
  />

  <main
    ref="main"
    :class="[{ '--offset' : isNavOpened }, 'main']"
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
    const isNavOpened = ref(false)

    const navHandler = () => {
      isNavOpened.value = !isNavOpened.value
    }

    onMounted(() => {
      if (main.value) {
        new SimpleBar(main.value, { autoHide: false })
      }
    })

    return {
      main,
      navHandler,
      isNavOpened
    }
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

  @include media('<laptop') {
    background-color: $accent;
  }

  @include media('>=laptop') {
    background-color: $white;
  }
}

.main {
  flex: none;
  position: relative;
  background-color: $white;

  @include media('<laptop') {
    width: 100vw;
    height: 100vh;
    left: 0;
    clip-path: circle(100%);
    transition: all 0.75s $animation;

    &.--offset {
      clip-path: circle(34%);
      left: -#{$asideWidthMobile};
      transition: all 0.5s $animation;
      animation: rotating 5s linear infinite;
    }
  }

  @include media('>=laptop') {
    width: calc(100% - #{$asideWidth});
    height: calc(100vh - #{$playerHeight});
  }
}

</style>
