<template>
  <section :class="[{ '--expanded': isPlaylistExpanded }, 'player']">
    <PlayerInfo />
    <PlayerControlPanel />
    <transition name="slide-in">
      <PlayerPlaylist v-if="isPlaylistExpanded" />
    </transition>
  </section>
</template>

<script setup lang="ts">
import { usePlayer } from '~features/player'
import PlayerInfo from './PlayerInfo.vue'
import PlayerPlaylist from './PlayerPlaylist.vue'
import PlayerControlPanel from './PlayerControlPanel.vue'

const { isPlaylistExpanded } = usePlayer()
</script>

<style lang="scss">
@use '~app/styles/variables' as var;

.player {
  position: fixed;
  bottom: 0;
  z-index: 2000;

  @include var.media('<laptop') {
    left: 0;
    box-shadow: var.$shadowMedium;
    display: grid;
    width: 100vw;

    &.--expanded {
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

    &:not(.--expanded) {
      height: 60px;
      background-color: var.$dark;
      grid-template-columns: 1fr 150px;

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

      .player__progress,
      .player__crackle,
      .player__sound,
      .player__youtube,
      .player__repeat {
        display: none;
      }
    }
  }

  @include var.media('>=laptop') {
    height: var.$playerHeight;
    display: flex;
    width: calc(100vw - var.$asideWidth);
    left: var.$asideWidth;
  }

  &.--z-low {
    z-index: 0;
  }
}
</style>