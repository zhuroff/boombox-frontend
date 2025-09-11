<template>
  <section class="playlist">
    <ul class="playlist__tracks">
      <VueDraggableNext
        handle=".playlist__track"
        v-bind="dragOptions"
        @end="orderChanged"
      >
        <PlayerPlaylistTrack
          v-for="(track, index) in enabledTracksOnly"
          :key="track._id"
          :order="index + 1"
          :track="track"
        />
      </VueDraggableNext>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { usePlaylistService } from '~features/player'
import PlayerPlaylistTrack from './PlayerPlaylistTrack.vue'
import type { DraggableEvent, ReorderPayload } from '~shared/lib'

const dragOptions = {
  animation: 300,
  disabled: false
}

const { primaryPlaylist } = usePlaylistService()

const enabledTracksOnly = computed(() => {
  return primaryPlaylist.value.filter((track) => !track.idDisabled)
})

const orderChanged = (event: DraggableEvent) => {
  const payload: ReorderPayload = {
    oldOrder: event.oldIndex,
    newOrder: event.newIndex,
  }
  console.log(payload)

  // changePlaylistOrder(payload)
}
</script>

<style lang="scss">
@use '~app/styles/variables' as var;

.playlist {
  position: fixed;
  z-index: 2000;
  width: 35vw;
  right: 0;
  bottom: var.$playerHeight;
  background-color: var.$white;
  height: calc(100vh - var.$playerHeight);
  overflow: auto;
  border-radius: 0;
  transition: all 0.5s var.$animation;
  box-shadow: 0 11px 15px -7px rgb(0 0 0 / 20%), 0 24px 38px 3px rgb(0 0 0 / 14%), 0 9px 46px 8px rgb(0 0 0 / 12%);

  @include var.media('>=laptop') {
    width: calc(19.48% * 2 - 4rem);
  }

  @include var.media('>=desktop') {
    width: calc(200px * 2 + 3rem);
  }

  @include var.media('>=desktop-md') {
    width: calc(250px * 2 + 3rem);
  }

  @include var.media('>=desktop-lg') {
    width: calc(275px * 2 + 3rem);
  }

  &.slide-in-enter-active {
    opacity: 0;
    transform: translateX(100%);
  }

  &.slide-in-enter-to {
    opacity: 1;
    transform: translateX(0);
  }

  &.slide-in-enter-from {
    opacity: 0;
    transform: translateX(100%);
  }

  &.slide-in-leave-active {
    opacity: 0;
    transform: translateX(100%);
  }

  &__tracks {
    overflow: hidden;
  }
}
</style>
