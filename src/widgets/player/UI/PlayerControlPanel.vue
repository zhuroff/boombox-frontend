<template>
  <div class="player__control">
    <div
      v-if="playingTrack?.isOnPlaying"
      class="player__control-panel"
    >
      <div class="player__control-group --main">
        <Button
          icon="previous"
          title="Play previous track"
          isRounded
          :isDisabled="!isPrevTrackAvailable || isSwitchingTrack"
          @click="playPrev"

        />
        <Button
          :icon="playingTrack.isOnPause ? 'play' : 'pause'"
          :title="playingTrack.isOnPause ? 'Play' : 'Pause'"
          size="large"
          isRounded
          @click="playPauseTrack"
        />
        <Button
          icon="next"
          title="Play next track"
          isRounded
          :isDisabled="!isNextTrackAvailable || isSwitchingTrack"
          @click="playNext"
        />
        <ProgressBar
          :isLeftTimeVisible="true"
          :isFullTimeVisible="true"
          :progressTime="progressTime"
          :progressLine="progressLine"
          :duration="playingTrack.duration"
          @setTrackPosition="setTrackPosition"
        />
      </div>

      <div :class="[{ '--screensave': screensaveMode }, 'player__control-group']">
        <PlayerSound v-if="!isMobile" />
        <Button
          icon="vinyl"
          title="Activate vinyl mode"
          isRounded
          :isDisabled="playingTrack?.isOnPause"
          :class="[{ '--active' : isVinylMode }]"
          @click="toggleVinylMode"
        />
        <Button
          icon="repeat"
          title="Repeat track"
          isRounded
          :class="[{ '--active' : playingTrack.isOnRepeat }]"
          @click="playingTrack.isOnRepeat = !playingTrack.isOnRepeat"
        />
        <Button
          icon="youtube"
          title="Search on YouTube"
          isRounded
          @click="searchOnYouTube"
        />
        <Button
          icon="playlist"
          title="Show playlist"
          isRounded
          :class="[{ '--active' : isPlaylistExpanded }]"
          @click="isPlaylistExpanded = !isPlaylistExpanded"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayer } from '~features/player'
import { Button, ProgressBar } from '~shared/UI'
import { useDevice } from '~shared/model'
import PlayerSound from './PlayerSound.vue'

const { isMobile } = useDevice()

const {
  playNext,
  playPrev,
  isVinylMode,
  playingTrack,
  progressTime,
  progressLine,
  screensaveMode,
  toggleVinylMode,
  isPlaylistExpanded,
  isNextTrackAvailable,
  isPrevTrackAvailable,
  setTrackPosition,
  playPauseTrack,
  isSwitchingTrack
} = usePlayer()

const searchOnYouTube = () => {
  if (!playingTrack.value) return
  const artistName = playingTrack.value.artist.title
  const title = playingTrack.value.title
  const url = `https://www.youtube.com/results?search_query=${artistName} ${title}`.replace(/ /g, '+')

  window.open(url)
}
</script>

<style lang="scss">
@use "sass:math";
@use '~app/styles/variables' as var;

.player {

  &__control {
    
    @include var.media('<desktop') {
      position: relative;
      z-index: 100;
      width: 100%;
      padding-bottom: 50px;
    }

    @include var.media('>=desktop') {
      background-color: var.$dark;
      padding: 0 var.$mainPadding 0 var.$minPadding;
      margin-top: math.div(var.$elementHeightXS, 1.5);
    }

    &-panel {
      display: flex;
      align-items: center;
      height: 100%;
      justify-content: space-between;

      @include var.media('<desktop') {
        flex-wrap: wrap;
        justify-content: center;
      }

      .button {
        border-color: var.$paleDP;

        .icon {
          color: var.$white;
          fill: var.$white;
        }

        &:hover {
          @include var.media('>=desktop') {
            background-color: var.$accent;
            border-color: var.$accent;
          }
        }

        &.--active {
          border-color: var.$accent;
          border-width: 2px;
        }
      }
    }

    &-group {
      display: flex;
      align-items: center;
      gap: var.$basicPadding;

      &.--main {

        @include var.media('<desktop') {
          flex-wrap: wrap;
          justify-content: center;
        }
      }

      &:not(.--main):not(.--screensave) {
        & > *:not(:last-of-type) {
          @include var.media('<desktop') {
            display: none;
          }
        }

        & > *:last-of-type {
          @include var.media('<desktop') {
            position: absolute;
            left: 1rem;
            top: 0.25rem;
          }
        }
      }
    }
  }
}
</style>
