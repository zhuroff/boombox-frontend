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

import { defineComponent, onMounted, provide, ref } from 'vue'
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
    const simplebar = ref<any>(null)

    provide('simplebar', simplebar)

    const navHandler = () => {
      isNavOpened.value = !isNavOpened.value
    }

    onMounted(() => {
      if (main.value) {
        simplebar.value = new SimpleBar(main.value, { autoHide: false })
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
  z-index: 1000;
  background-color: $white;

  @include media('<laptop') {
    width: 100vw;
    height: 100vh;
    left: 0;
    clip-path: circle(100%);
    transition: all 0.75s $animation;
    padding-bottom: 60px;

    &.--offset {
      clip-path: circle(34%);
      left: -#{$asideWidthMobile};
      transition: all 0.5s $animation;
      filter: grayscale(1);
      animation: rotating 5s linear infinite;

      &:before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100px;
        height: 100px;
        background-color: $black;
        border-radius: 50%;
        border: 4px solid $pale;
        z-index: 1;
        animation: appearance 0.75s $animation;
      }

      &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 30px;
        height: 30px;
        background-color: $white;
        border-radius: 50%;
        border: 2px solid $dark;
        z-index: 2;
        animation: appearance 0.75s $animation;
      }
    }
  }

  @include media('>=laptop') {
    width: calc(100% - #{$asideWidth});
    height: calc(100vh - #{$playerHeight});
  }
}

</style>
