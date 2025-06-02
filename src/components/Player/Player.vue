<template>
  <section :class="[{ '--expanded': isPlayerExpanded }, 'player']">
    <!-- <div
      class="player__left"
      @click="collapseExpandPlayer"
    > -->
    <div
      class="player__left"
      v-if="!playingTrack"
    />
    <RouterLink
      v-else
      class="player__left"
      :to="{ path: `/albums/${playingTrack?.albumID}` }"
    >
      <div
        v-if="playingTrack.progressTime > 0"
        class="player__left-content"
      >
        <img
          :src="playingTrack.cover"
          :alt="playingTrack.title"
          class="player__cover"
        />
        <div class="player__title">
          <div class="player__title-track">{{ playingTrack.title }}</div>
          <div class="player__title-artist">
            {{ playingTrack.artistName }} <br> ({{ playingTrack.albumName }}{{ playingTrack.year ? `, ${playingTrack.year}` : `` }})
          </div>
        </div>
      </div>
    </RouterLink>
    <div class="player__right">
      <div v-if="playingTrack?.progressTime" class="player__right-content">
        <PlayerRepeatTrack />
        <PlayerPrevTrack />
        <PlayerPlayPause />
        <PlayerNextTrack />
        <PlayerProgressBar />
        <PlayerRepeatTrack isMobile />
        <PlayerCrackle />
        <PlayerSound />
        <PlayerExternal />
        <PlayerList
          :isActive="isPlaylistOpen"
          @togglePlaylistState="togglePlaylistState"
        />
      </div>
    </div>
    <!-- <transition name="slide-in">
      <Overlay v-if="isPlaylistOpen">
        <ul class="overlay__list">
          <VueDraggableNext
            handle=".overlay__list-item"
            v-bind="dragOptions"
            @end="orderChanged"
          >
            <li
              v-for="(track, index) in currentPlaylistTracks"
              :class="[{ '--active' : isPlaying(track._id) }, 'overlay__list-item']"
              :key="track._id"
              @click="() => playCurrentTrack(track)"
            >
              <div class="overlay__list-cover">
                <img :src="track.albumCover" referrerpolicy="no-referrer" />
                <Sprite v-if="isPlaying(track._id)" name="playing" />
              </div>
              <div class="overlay__list-info">
                <strong>{{ index + 1 < 10 ? `0${index + 1}` : index + 1 }}. {{ track.title }}</strong>
                <div>
                  <span>{{ track.artist.title }} | </span>
                  <span>{{ track.inAlbum.title }}</span>
                </div>
              </div>
              <time>{{ trackTime(track.duration) }}</time>
              <Button
                icon="close"
                size="small"
                isText
                isInverted
                @click="(e) => removeFromPlaylist(e, track._id)"
              />
            </li>
          </VueDraggableNext>
        </ul>
      </Overlay>
    </transition> -->
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import type { DraggableEvent } from '~/types/Common'
import { VueDraggableNext } from 'vue-draggable-next'
import { secondsToMinutes } from '~/utils'
import usePlaylist from '~/store/playlist'
import AlbumTrack from '~/classes/AlbumTrack'
import PlayerRepeatTrack from './PlayerRepeatTrack.vue'
import PlayerPrevTrack from './PlayerPrevTrack.vue'
import PlayerNextTrack from './PlayerNextTrack.vue'
import PlayerPlayPause from './PlayerPlayPause.vue'
import PlayerProgressBar from './PlayerProgressBar.vue'
import PlayerCrackle from './PlayerCrackle.vue'
import PlayerSound from './PlayerSound.vue'
import PlayerExternal from './PlayerExternal.vue'
import PlayerList from './PlayerList.vue'
// import { Button, Sprite } from '~shared/UI'

type PlayerKeyNav = 'Space' | 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown'

const {
  playerGetters: {
    playingTrack,
    currentPlaylist,
    currentPlaylistTracks,
    isPlayerExpanded
  },
  playerActions: {
    playTrack,
    continuePlay,
    setTrackOnPause,
    changePlaylistOrder,
    removeTrackFromPlaylist,
    switchToPrevTrack,
    switchToNextTrack,
    togglePlayerVisibility
  }
} = usePlaylist()

const isPlaylistOpen = ref(false)
const dragOptions = reactive({
  animation: 300,
  disabled: false
})

const trackTime = (duration: number) => secondsToMinutes(duration)
const isPlaying = (id: string) => id === playingTrack.value?._id

const orderChanged = (event: DraggableEvent) => {
  const payload: ReorderPayload = {
    oldOrder: event.oldIndex,
    newOrder: event.newIndex,
    entityID: currentPlaylist.value?._id
  }

  changePlaylistOrder(payload)
}

const playOrPause = () => {
  if (playingTrack.value?.isOnPause) {
    continuePlay()
  } else {
    setTrackOnPause()
  }
}

const volumeUp = () => {
  console.log('Volume up!')
}

const volumeDown = () => {
  console.log('Volume down!')
}

const togglePlaylistState = () => {
  isPlaylistOpen.value = !isPlaylistOpen.value
}

const playCurrentTrack = (track: AlbumTrack) => {
  playTrack(track)
  togglePlayerVisibility()
}

const removeFromPlaylist = (event: Event, id: string) => {
  event.stopPropagation()
  removeTrackFromPlaylist(id)
}

const keyboardPlayerKeys = {
  Space: playOrPause,
  ArrowLeft: switchToPrevTrack,
  ArrowRight: switchToNextTrack,
  ArrowUp: volumeUp,
  ArrowDown: volumeDown
}

const keyboardNavHandler = (event: KeyboardEvent) => {
  const keyCode = event.code as PlayerKeyNav
  const inputTags = ['TEXTAREA', 'INPUT', 'BUTTON']
  const isInputTags = inputTags.includes((event.target as HTMLInputElement).tagName)

  if (keyboardPlayerKeys[keyCode] && !isInputTags && playingTrack.value?._id) {
    keyboardPlayerKeys[keyCode]()
  }
}

onMounted(() => {
  document.addEventListener('keyup', keyboardNavHandler)
})

onUnmounted(() => {
  document.removeEventListener('keyup', keyboardNavHandler)
})
</script>

<style lang="scss">
@use '~/app/styles/variables' as var;

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

  &__left {
    flex: none;
    transition: all 0.3s var.$animation;

    @include var.media('<laptop') {
      position: relative;
      z-index: 100;
      padding-top: 70px;

      @include var.media('landscape') {
        padding-top: 25px;
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
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background-color: var.$black;
        position: absolute;
        left: 50%;
        top: calc(50% - 30px);
        transform: translate(-50%, -50%);

        @include var.media('landscape') {
          top: calc(50% - -45px);
        }
      }
    }

    @include var.media('>=laptop') {
      background-color: var.$accent;
      position: absolute;
      left: 0;
      top: 0;
      width: var.$asideWidth;
      height: 100%;
      padding: 12px 15px 12px 25px;

      &:hover {
        min-width: var.$asideWidth;
        width: 100%;
        z-index: 20;
        transition: all 0.3s ease;
      }
    }

    &-content {

      @include var.media('<laptop') {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      @include var.media('>=laptop') {
        display: flex;
        align-items: center;
      }
    }
  }

  &__right {

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

    &-content {
      display: flex;
      align-items: center;
      height: 100%;

      @include var.media('<laptop') {
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  }

  &__cover {

    @include var.media('<laptop') {
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

    @include var.media('>=laptop') {
      width: 40px;
      height: 40px;
      border-radius: 3px;
      flex: none;
    }
  }

  &__title {
    color: var.$white;

    @include var.media('<laptop') {
      text-align: center;
      margin-top: auto;
      padding: 0 25px 40px;
    }

    @include var.media('>=laptop') {
      margin-left: 12px;
      width: calc(100% - 50px);
    }

    &-track {
      font-weight: 600;

      @include var.media('<laptop') {
        font-size: 20px;
        margin-bottom: 5px;
      }

      @include var.media('>=laptop') {
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    &-artist {

      @include var.media('<laptop') {
        font-size: 14px;
      }

      @include var.media('>=laptop') {
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

  &__repeat {
    background-color: transparent;
    border: 0;
    padding: 0;
    cursor: pointer;
    justify-content: center;
    align-items: center;

    .icon-repeat {
      width: 100%;
      height: 100%;
    }

    @include var.media('<laptop') {
      display: none;
    }

    @include var.media('>=laptop') {
      display: flex;
      width: 15px;
      height: 15px;
      margin-right: 50px;
    }

    &.--mobile {

      @include var.media('<laptop') {
        display: flex;
        margin-right: 25px;
        width: 24px;
        height: 24px;
      }

      @include var.media('>=laptop') {
        display: none;
      }
    }
  }

  &__play,
  &__pause {
    background-color: rgba(245, 30, 56, 0.3);
    position: relative;
    width: 45px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0;
    cursor: pointer;
    border-radius: 50%;
    flex: none;
    margin: 0 20px;
    padding: 0;

    &:before {
      content: '';
      position: absolute;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      top: 5px;
      left: 5px;
      background-color: var.$accent;
      transition: all 0.2s ease;
    }

    &:hover {

      &:before {
        width: 45px;
        height: 45px;
        top: 0;
        left: 0;
        transition: all 0.2s ease;
      }
    }

    .icon {
      position: relative;
      z-index: 10;
      width: 24px;
      height: 24px;
      color: var.$white;
    }
  }

  &__next,
  &__previous {
    width: 24px;
    height: 24px;
    background-color: transparent;
    cursor: pointer;
    border: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .icon {
      color: var.$white;
    }

    &[disabled] {
      opacity: 0.25;
      pointer-events: none;
    }
  }

  &__next {

    @include var.media('>=laptop') {
      margin-right: 50px;
    }
  }

  &__progress {
    display: flex;
    align-items: center;

    @include var.media('<laptop') {
      padding: var.$basicPadding 25px;
      width: 100vw;
    }

    &-bar {
      appearance: none;
      background-color: var.$white;
      cursor: pointer;
      margin: 0 var.$basicPadding;
      border: 0;
      border-radius: var.$basicPadding;

      @include var.media('<laptop') {
        flex: 1 1 0;
        height: 5px;
      }

      @include var.media('>=laptop') {
        width: 326px;
        height: var.$basicPadding;
      }

      &::-webkit-progress-bar {
        border: 0;
        border-radius: var.$basicPadding;

        @include var.media('<laptop') {
          height: 5px;
        }

        @include var.media('>=laptop') {
          height: var.$basicPadding;
        }
      }

      &::-webkit-progress-value {
        background-color: var.$accent;
        border-radius: 5px;
      }
    }

    &-time {
      color: var.$white;
      opacity: 0.5;
      font-size: 12px;
      position: relative;
      top: -1px;
    }
  }

  &__crackle {
    height: 24px;
    width: inherit;
    border: 0;
    background-color: transparent;
    cursor: pointer;
    position: relative;
    z-index: 10;
    padding: 0;

    @include var.media('>=laptop') {
      margin-left: auto;
    }

    .icon-vinyl {
      width: 24px;
      height: 24px;
      color: var.$white;
    }

    &.--active {

      .icon-vinyl {
        color: var.$accent;
      }
    }
  }

  &__sound {
    width: 24px;
    position: relative;
    margin: 0 0 0 25px;
    display: flex;
    align-items: center;
    z-index: 10;
    overflow: hidden;

    @include var.media('<laptop') {
      height: auto;
    }

    @include var.media('>=laptop') {
      height: 100%;
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
      right: -#{var.$basicPadding};
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

    &_button {
      height: 22px;
      width: inherit;
      border: 0;
      background-color: transparent;
      cursor: pointer;
      position: relative;
      z-index: 10;
      padding: 0;

      .icon {
        color: var.$white;
      }

      &.--muted {

        .icon {
          color: var.$accent;
        }
      }
    }

    .icon-sound {
      width: 22px;
      height: 22px;
      fill: var.$white;
    }

    &:hover {

      .player__sound_range {
        opacity: 1;
        max-height: 175px;
        overflow: inherit;
        transform: translateY(0);
        transition: opacity 0.5s ease, transform 0.7s ease;
      }
    }
  }

  &__youtube {

    @include var.media('<laptop') {
      display: none;
    }

    @include var.media('>=laptop') {
      margin-left: 23px;
      width: 25px;
      height: 25px;
      cursor: pointer;
      border: 0;
      background-color: transparent;
      padding: 0;

      .icon {
        width: 24px;
        color: var.$white;
      }
    }
  }

  .overlay {
    width: 100vw;
    max-width: 777px;
    right: 0;
    bottom: var.$playerHeight;
    background-color: var.$transBlack;
    height: calc(100vh - var.$playerHeight);
    overflow: auto;
    border-radius: 0;
    transition: all 0.5s var.$animation;

    &.slide-in-enter-active {
      opacity: 0;
      transform: translateX(100%);
    }

    &.slide-in-enter-to {
      opacity: 1;
      transform: translateX(0);
    }

    &.slide-in-enter-from {
      opacity: 0;
      transform: translateX(100%);
    }

    &.slide-in-leave-active {
      opacity: 0;
      transform: translateX(100%);
    }

    &__list {
      overflow: hidden;

      &-item {
        display: flex;
        align-items: center;
        padding-right: 0;

        img {
          width: inherit;
          height: inherit;
          object-fit: cover;
          border-radius: var.$borderRadiusSM;
          max-height: 100%;
          display: block;
        }

        strong {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          font-size: 0.875rem;
          color: var.$paleMD;
          transition: all 0.2s var.$animation;
        }

        span {
          font-size: 0.75rem;
          color: var.$paleDP;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          transition: all 0.2s var.$animation;
        }

        time {
          margin-left: auto;
          color: var.$paleDP;
          white-space: nowrap;
          font-size: 0.875rem;
          transition: all 0.2s var.$animation;
        }

        &.--active,
        &:hover {
          background-color: transparent;

          strong {
            color: var.$white;
            transition: all 0.2s var.$animation;
          }

          span,
          time {
            color: var.$paleLT;
            transition: all 0.2s var.$animation;
          }
        }
      }

      &-cover {
        position: relative;
        width: 40px;
        height: 40px;
        margin: 0rem 0.875rem 0 0;

        .playing {
          position: absolute;
          width: 25px;
          height: 25px;
          z-index: 10;
          fill: var.$white;
          color: var.$white;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }

      &-info {
        line-height: 1.2;
        width: calc(100% - 110px);
        padding-right: 1rem;
      }
    }
  }
}
</style>
