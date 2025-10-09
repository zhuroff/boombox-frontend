<template>  
  <div class="player__sound">
    <div class="player__sound-range">
      <input
        type="range"
        :min="0"
        :max="1"
        :step="0.001"
        :value="trackVolume"
        class="player__sound-input"
        @input="changeSoundVolume"
      />
    </div>
    <Button
      :icon="isTrackMuted ? 'volume-off' : 'volume'"
      :class="[{ '--muted' : isTrackMuted }]"
      isRounded
      @click="toggleMuteState"
    />
  </div>
</template>

<script setup lang="ts">
import { usePlayer } from '~features/player'
import { Button } from '~shared/UI'

const { trackVolume, setSoundVolume, isTrackMuted, toggleMuteState } = usePlayer()

const changeSoundVolume = (event: Event) => {
  setSoundVolume(Number((event.target as HTMLInputElement).value))
}
</script>

<style lang="scss">
@use '~app/styles/variables' as var;

.player__sound {
  position: relative;
  display: flex;
  align-items: center;
  z-index: 10;
  overflow: hidden;

  @include var.media('<desktop') {
    height: auto;
  }

  &:hover {
    overflow: inherit;

    .player__sound-range {
      opacity: 1;
      transform: translateX(0);
      transition: all 0.3s var.$animation;
    }
  }

  &-range {
    position: absolute;
    right: var.$basicPadding;
    top: 0;
    height: 100%;
    padding: 0 40px 0 15px;
    background-color: var.$dark;
    display: flex;
    align-items: center;
    opacity: 0;
    transform: translateX(20px);
  }

  &-input {
    width: 175px;
    appearance: none;
    background-color: transparent;

    &::-webkit-slider-runnable-track {
      background-color: var.$accent;
      width: 100%;
      height: var.$basicPadding;
      border-radius: var.$basicPadding;
    }

    &::-webkit-slider-thumb {
      width: 16px;
      height: 16px;
      background-color: var.$white;
      appearance: none;
      border-radius: 50%;
      position: relative;
      top: -3px;
      right: 0;
      cursor: pointer;
    }
  }

  .button {
    position: relative;
    z-index: 10;

    &.--muted {
      border-color: var.$accent;
      border-width: 2px;
    }
  }
}
</style>
