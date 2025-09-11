<template>
  <div class="player__control">
    <div
      v-if="playingTrack?.isOnPlaying"
      class="player__control-panel"
    >
      <div class="player__control-group">
        <Button
          icon="previous"
          title="Play previous track"
          isRounded
          :isDisabled="!isPrevTrackAvailable"
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
          :isDisabled="!isNextTrackAvailable"
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

      <div class="player__control-group">
        <PlayerSound />
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
import PlayerSound from './PlayerSound.vue'

const {
  playNext,
  playPrev,
  isVinylMode,
  playingTrack,
  progressTime,
  progressLine,
  toggleVinylMode,
  isPlaylistExpanded,
  isNextTrackAvailable,
  isPrevTrackAvailable,
  setTrackPosition,
  playPauseTrack
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
      justify-content: space-between;

      @include var.media('<laptop') {
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
          background-color: var.$accent;
          border-color: var.$accent;
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
    }
  }
}
</style>
