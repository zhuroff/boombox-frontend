<template>  
  <button
    class="player__next"
    :disabled="!isNextTrackExists"
    @click="switchToNextTrack"
  >
    <Sprite name="next" />
  </button>
</template>

<script setup lang="ts">
import usePlaylist from '~/store/playlist'
import { Sprite } from '~shared/UI'

const {
  playerGetters: { isNextTrackExists },
  playerActions: { switchToNextTrack }
} = usePlaylist()
</script>
