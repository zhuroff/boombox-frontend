<template>
  <div class="container">
    <Sidebar :isExpanded="isNavOpened" />
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
import { Player } from '~widgets/player'
import { Snackbar } from '~shared/UI'

const main = ref(null)
const isNavOpened = ref(false)
</script>

<style lang="scss">
@use '~app/styles/variables' as var;

.container {
  display: flex;
  position: relative;

  @include var.media('>=desktop') {
    background-color: var.$paleLT;
    overflow: hidden;
    height: 100vh;
  }
}

.main {
  flex: none;

  @include var.media('<desktop') {
    width: 100vw;
    min-height: 100vh;
    background-color: var.$black;
  }

  @include var.media('>=desktop') {
    position: relative;
    z-index: 1000;
    overflow: auto;
    width: calc(100% - var.$asideWidth);
    height: calc(100vh - var.$playerHeight);
    background-color: var.$paleLT;
  }

  .content {
    padding: 2rem 1rem var.$mainPadding 1rem;

    @include var.media('<desktop') {
      margin-top: 1.5rem;
    }

    @include var.media('>=desktop') {
      display: flex;
      flex-direction: column;
      min-height: calc(100vh - (var.$desktopHeaderHeight + var.$playerHeight));
    }
  }
}
</style>
