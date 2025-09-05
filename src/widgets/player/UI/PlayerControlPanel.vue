<template>
  <div class="player__control">
    <div
      v-if="playingTrack?.isOnPlaying"
      class="player__control-panel"
    >
      <ProgressBar
        :isLeftTimeVisible="true"
        :isFullTimeVisible="true"
        :progressTime="progressTime"
        :progressLine="progressLine"
        :duration="playingTrack.duration"
        @setTrackPosition="setTrackPosition"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayer } from '~features/player'
import ProgressBar from './ProgressBar.vue'

const { playingTrack, progressTime, progressLine, setTrackPosition } = usePlayer()
</script>

<style lang="scss">
@use '~app/styles/variables' as var;

.player {

  &__control {
    
    @include var.media('<laptop') {
      position: relative;
      z-index: 100;
      width: 100%;
      padding-bottom: 50px;
    }

    @include var.media('>=laptop') {
      background-color: var.$dark;
      width: calc(100% - var.$asideWidth);
      padding: 0 25px;
      margin-left: auto;
    }

    &-panel {
      display: flex;
      align-items: center;
      height: 100%;

      @include var.media('<laptop') {
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  }
}
</style>