<template>
  <section :class="[{ '--screensave': screensaveMode && isMobile }, 'player']">
    <Button
      v-if="isMobile"
      icon="chevron-down"
      className="player__collapse"
      size="large"
      isText
      @click="screensaveMode = !screensaveMode"
    />
    <PlayerInfo />
    <PlayerControlPanel />
    <transition name="slide-in">
      <PlayerPlaylist v-if="isPlaylistExpanded" />
    </transition>
  </section>
</template>

<script setup lang="ts">
import { useDevice } from '~shared/model'
import { usePlayer } from '~features/player'
import { Button } from '~shared/UI'
import PlayerInfo from './PlayerInfo.vue'
import PlayerPlaylist from './PlayerPlaylist.vue'
import PlayerControlPanel from './PlayerControlPanel.vue'

const { isMobile } = useDevice()
const { screensaveMode, isPlaylistExpanded } = usePlayer()
</script>

<style lang="scss">
@use '~app/styles/variables' as var;

.player {
  position: fixed;
  bottom: 0;
  z-index: 9999;

  @include var.media('<desktop') {
    left: 0;
    box-shadow: var.$shadowMedium;
    width: 100vw;

    &.--screensave {
      display: grid;
      height: 100vh;
      grid-template-columns: 100%;
      grid-template-rows: 73vh 27vh;

      @include var.media('landscape') {
        grid-template-rows: 65vh 35vh;
      }

      &:before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        z-index: 10;
        background: linear-gradient(to top left, var.$dark 50%, var.$accent 50%);
      }
    }

    &:not(.--screensave) {
      height: 3.5rem;
      background-color: var.$black;
      grid-template-columns: 1fr 150px;
      display: flex;
      align-items: center;

      .player__info,
      .player__progress {
        display: none;
      }

      .player__collapse {
        top: 0.25rem;
      }

      .player__control {
        padding-bottom: 0;
      }

      .player__left {
        padding-top: 0;
        overflow: hidden;

        &:before,
        &:after {
          content: none;
        }

        &-content {
          flex-direction: row;
          position: relative;

          &:after {
            content: '';
            background: linear-gradient(to right, transparent 0%, var.$dark 100%);
            width: 50px;
            height: 100%;
            position: absolute;
            right: 0;
            top: 0;
          }
        }
      }

      .player__right {
        width: auto;
        padding-bottom: 0;
        padding-right: var.$basicPadding;

        &-content {
          justify-content: flex-end;
        }
      }

      .player__collapse {
        transform: rotate(180deg);
      }

      .player__cover {
        width: 50px;
        height: 50px;
        animation: none;
        top: 0;
        border-radius: 3px;
        margin: 5px 15px 5px 5px;
      }

      .player__title {
        padding: 0;
        text-align: left;
        margin-top: 11px;

        &-track {
          font-size: 14px;
          margin-bottom: 1px;
          white-space: nowrap;
        }

        &-artist {
          white-space: nowrap;

          br {
            display: none;
          }
        }
      }

      .player__crackle,
      .player__sound,
      .player__youtube {
        display: none;
      }
    }
  }

  &__collapse {

    @include var.media('<desktop') {
      position: absolute;
      top: 0;
      right: var.$minPadding;
      z-index: 1000;

      .icon {
        fill: var.$white;
      }
    }
  }

  @include var.media('>=desktop') {
    height: var.$playerHeight;
    display: flex;
    width: calc(100vw - var.$asideWidth);
    left: var.$asideWidth;
  }

  &.--z-low {
    z-index: 999;
  }
}
</style>