<template>  
  <button
    v-if="playingTrack?.isOnPause"
    class="player__play"
    @click="continuePlay"  
  >
    <Sprite name="play" />
  </button>
  <button
    v-else
    class="player__pause"
    @click="setTrackOnPause"
  >
    <Sprite name="pause" />
  </button>
</template>

<script setup lang="ts">
import usePlayingTrack from '~/store/track'
import Sprite from '~/components/Sprite/Sprite.vue'

const {
  trackGetters: { playingTrack },
  trackActions: { continuePlay, setTrackOnPause }
} = usePlayingTrack()
</script>
