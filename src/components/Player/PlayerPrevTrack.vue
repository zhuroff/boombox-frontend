<template>  
  <button
    class="player__previous"
    :disabled="!isPrevTrackExists"
    @click="switchToPrevTrack"
  >
    <Sprite name="previous" />
  </button>
</template>

<script setup lang="ts">
import usePlaylist from '~/store/playlist'
import Sprite from '~/components/Sprite/Sprite.vue'

const {
  playerGetters: { isPrevTrackExists },
  playerActions: { switchToPrevTrack }
} = usePlaylist()
</script>
