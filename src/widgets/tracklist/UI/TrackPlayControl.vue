<template>
  <Button
    v-if="fetchingTrackId === track._id"
    icon="spinner"
    size="small"
    isText
    className="trackrow__action --highlighted"
  />
  <Button
    v-else-if="isTrackPlaying"
    icon="playing"
    size="small"
    isText
    className="trackrow__action --highlighted"
    @mouseenter="isOnHover = true"
  />
  <Button
    v-else-if="isTrackPaused"
    icon="pause"
    size="small"
    isText
    className="trackrow__action --rounded"
    @click="playPauseTrack"
    @mouseleave="isOnHover = false"
  />
  <Button
    v-else
    icon="play"
    size="small"
    isText
    className="trackrow__action --rounded"
    @click="() => playTrack(track)"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayer } from '~features/player'
import { Button } from '~shared/UI'
import type { TrackBasic } from '~entities/track'

type Props = {
  track: TrackBasic
}

const props = defineProps<Props>()

const isOnHover = ref(false)

const { playTrack, playPauseTrack, playingTrack, fetchingTrackId } = usePlayer()

const isTrackPlaying = computed(() => (
  playingTrack.value &&
  playingTrack.value._id === props.track._id &&
  playingTrack.value.isOnPlaying &&
  !playingTrack.value.isOnPause &&
  !isOnHover.value
))

const isTrackPaused = computed(() => (
  playingTrack.value &&
  playingTrack.value._id === props.track._id &&
  playingTrack.value.isOnPause ||
  isOnHover.value
))
</script>

<style lang="scss">
@use '~/app/styles/variables' as var;

.trackrow__action {
  
  &.--rounded {
    border-radius: 50%;
    margin: 0 var.$minPadding 0 var.$fieldPadding;

    @include var.media('<desktop') {
      box-shadow: var.$paleDP 0px 3px 8px;

      .icon {
        color: var.$light;
      }
    }

    @include var.media('>=desktop') {
      box-shadow: var.$paleLW 0px 3px 8px;
    }
  }

  &.--highlighted {
    margin: 0 var.$minPadding 0 var.$fieldPadding;
    
    .icon {
      fill: var.$accent !important;
      color: var.$accent !important;
      stroke: var.$accent !important;
    }
  }
}
</style>
