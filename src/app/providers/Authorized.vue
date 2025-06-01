<template>
  <div class="container">
    <Sidebar
      :isExpanded="isNavOpened"
      @burgerClick="navHandler"
    />
    <main
      ref="main"
      :class="[{ '--offset': isNavOpened }, 'main']"
    >
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </main>
    <Player />
    <Snackbar />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Sidebar } from '~widgets/sidebar'
import Player from '~/components/Player/Player.vue'
import { Snackbar } from '~shared/UI'

const main = ref(null)
const isNavOpened = ref(false)

const navHandler = () => {
  isNavOpened.value = !isNavOpened.value
}
</script>

<style lang="scss">
@use '~/scss/variables' as var;

.container {
  height: 100vh;
  display: flex;
  overflow: hidden;
  position: relative;

  @include var.media('<laptop') {
    background-color: var.$accent;
  }

  @include var.media('>=laptop') {
    background-color: var.$paleLT;
  }
}

.main {
  flex: none;
  position: relative;
  z-index: 1000;
  background-color: var.$paleLT;
  overflow: auto;

  @include var.media('<laptop') {
    width: 100vw;
    height: 100vh;
    left: 0;
    clip-path: circle(100%);
    transition: all 0.75s var.$animation;
    padding-bottom: 60px;

    &.--offset {
      clip-path: circle(34%);
      left: -#{var.$asideWidthMobile};
      transition: all 0.5s var.$animation;
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
        background-color: var.$black;
        border-radius: 50%;
        border: 4px solid var.$paleDP;
        z-index: 1;
        animation: appearance 0.75s var.$animation;
      }

      &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 30px;
        height: 30px;
        background-color: var.$white;
        border-radius: 50%;
        border: 2px solid var.$dark;
        z-index: 2;
        animation: appearance 0.75s var.$animation;
      }
    }
  }

  @include var.media('>=laptop') {
    width: calc(100% - var.$asideWidth);
    height: calc(100vh - var.$playerHeight);
  }

  .content {
    padding: 2rem 1rem var.$mainPadding 1rem;

    @include var.media('>=laptop') {
      display: flex;
      flex-direction: column;
      min-height: calc(100vh - (var.$desktopHeaderHeight + var.$playerHeight));
    }
  }
}
</style>
