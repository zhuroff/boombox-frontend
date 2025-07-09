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
import usePlaylist from '~/store/playlist'
import { Sprite } from '~shared/UI'

const {
  playerGetters: { playingTrack },
  playerActions: { continuePlay, setTrackOnPause }
} = usePlaylist()
</script>
