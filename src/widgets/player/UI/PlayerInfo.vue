<template>
  <div
    class="player__info"
    v-if="!playingTrack"
  />
  <RouterLink
    v-else
    class="player__info"
    :to="{ path: albumRoute }"
  >
    <div
      v-if="progressTime > 0"
      class="player__info-content"
    >
      <img
        :src="proxiedAlbumCover"
        :alt="playingTrack.title"
        class="player__cover"
      />
      <div class="player__title">
        <div class="player__title-track">{{ playingTrack.title }}</div>
        <div class="player__title-sign">
          {{ trackSign }}
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayer } from '~features/player'
import { proxyCloudUrl } from '~shared/lib'

const { progressTime, playingTrack } = usePlayer()

const proxiedAlbumCover = computed(() => proxyCloudUrl(playingTrack.value?.albumCover))

const albumRoute = computed(() => {
  switch(playingTrack.value?.albumKind) {
    case 'album':
      return `/albums/${playingTrack.value?.albumId}`
    case 'compilation':
      return `/compilations/${playingTrack.value.albumId}`
    default:
      return ''
  }
})

const trackSign = computed(() => {
  const artistName = playingTrack.value?.artist.title
  const albumTitle = playingTrack.value?.inAlbum.title
  const releaseYear = playingTrack.value?.period.title

  return `${artistName} (${albumTitle}${releaseYear ? `, ${releaseYear}` : ''})`
})
</script>

<style lang="scss">
@use "sass:math";
@use '~app/styles/variables' as var;

.player {

  &__info {
    flex: none;
    transition: all 0.3s var.$animation;

    @include var.media('<desktop') {
      position: relative;
      z-index: 100;
      padding-top: 70px;

      @include var.media('landscape') {
        padding-top: var.$mainPadding;
      }

      &:before {
        content: '';
        position: absolute;
        animation: rotating 5s linear infinite;
        width: 280px;
        height: 280px;
        left: calc(50% - 140px);
        border-radius: 50%;
        box-shadow: var.$shadowMedium;
        background:
          linear-gradient(30deg, transparent 40%, rgba(42, 41, 40, .85) 40%) no-repeat 100% 0,
          linear-gradient(60deg, rgba(42, 41, 40, .85) 60%, transparent 60%) no-repeat 0 100%,
          repeating-radial-gradient(#2a2928, #2a2928 4px, #ada9a0 5px, #2a2928 6px);
        background-size: 50% 100%, 100% 50%, 100% 100%;
      }

      &:after {
        content: '';
        width: var.$elementHeightXS;
        height: var.$elementHeightXS;
        border-radius: 50%;
        background-color: var.$paleLW;
        position: absolute;
        left: 50%;
        top: 13rem;
        transform: translateX(-50%);
      }
    }

    @include var.media('>=desktop') {
      background-color: var.$dark;
      height: 100%;
      padding: 12px 15px 12px 0;
      margin-top: math.div(var.$elementHeightXS, 1.5);
    }

    &-content {

      @include var.media('<desktop') {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      @include var.media('>=desktop') {
        display: flex;
        align-items: center;
      }
    }
  }

  &__cover {

    @include var.media('<desktop') {
      border-radius: 50%;
      width: 94px;
      height: 94px;
      max-width: 500px;
      max-height: 500px;
      display: block;
      margin: 0 auto;
      position: relative;
      top: 93px;
      animation: rotating 5s linear infinite;
    }

    @include var.media('>=desktop') {
      width: 40px;
      height: 40px;
      border-radius: 3px;
      flex: none;
    }
  }

  &__title {
    color: var.$white;

    @include var.media('<desktop') {
      text-align: center;
      margin-top: auto;
      padding: 0 var.$mainPadding 40px;
      position: relative;
      z-index: 100;
    }

    @include var.media('>=desktop') {
      margin-left: 12px;
      width: calc(100% - 50px);
    }

    &-track {
      font-weight: 600;

      @include var.media('<desktop') {
        font-size: 20px;
        margin-bottom: 5px;
      }

      @include var.media('>=desktop') {
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    &-sign {

      @include var.media('<desktop') {
        font-size: 14px;
      }

      @include var.media('>=desktop') {
        font-size: 12px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        br {
          display: none;
        }
      }
    }
  }
}
</style>
