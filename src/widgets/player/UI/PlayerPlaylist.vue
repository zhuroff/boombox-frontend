<template>
  <section class="playlist">
    <Button
      v-if="isMobile"
      icon="close"
      isText
      className="playlist__collapse"
      @click="isPlaylistExpanded = false"
    />
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
import { usePlaylistService, usePlayer } from '~features/player'
import { Button } from '~shared/UI'
import { useDevice } from '~shared/model'
import PlayerPlaylistTrack from './PlayerPlaylistTrack.vue'
import type { DraggableEvent, ReorderPayload } from '~shared/lib'

const dragOptions = {
  animation: 300,
  disabled: false
}

const { isMobile } = useDevice()
const { isPlaylistExpanded } = usePlayer()
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
  width: 100vw;
  right: 0;
  top: 0;
  background-color: var.$white;
  height: 100vh;
  overflow: auto;
  border-radius: 0;
  transition: all 0.5s var.$animation;
  box-shadow: 0 11px 15px -7px rgb(0 0 0 / 20%), 0 24px 38px 3px rgb(0 0 0 / 14%), 0 9px 46px 8px rgb(0 0 0 / 12%);

  @include var.media('<desktop') {
    padding-top: var.$doublePadding;
  }

  @include var.media('>=desktop') {
    width: calc(19.48% * 2 - 4rem);
    height: calc(100vh - var.$playerHeight);
    bottom: var.$playerHeight;
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

  &__collapse {
    position: absolute;
    top: var.$minPadding;
    left: var.$minPadding;
  }
}
</style>
