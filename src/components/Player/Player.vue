<template>
  <section :class="[{ '--expanded': isPlayerExpanded }, 'player']">
    <!-- <div
      class="player__left"
      @click="collapseExpandPlayer"
    > -->
    <RouterLink
      class="player__left"
      :to="{ path: `/albums/${playingTrack.albumID}` }"
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
            {{ playingTrack.artistName }} <br> ({{ playingTrack.albumName }}, {{ playingTrack.year }})
          </div>
        </div>
      </div>
    </RouterLink>
    <div class="player__right">
      <div v-if="playingTrack.progressTime > 0" class="player__right-content">
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
    <transition name="slide-in">
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
              @click="() => playTrack(track)"
            >
              <div class="overlay__list-cover">
                <img :src="track.albumCover" />
                <Sprite v-if="isPlaying(track._id)" name="playing" />
              </div>
              <div class="overlay__list-info">
                <strong>{{ index + 1 }} - {{ track.title }}</strong>
                <span>{{ track.artist.title }}</span>
                <span>{{ track.inAlbum.title }}</span>
              </div>
              <time>{{ trackTime(track.duration) }}</time>
              <Button
                icon="close"
                size="small"
                isOutlined
                isText
                @click="(e) => removeFromPlaylist(e, track._id)"
              />
            </li>
          </VueDraggableNext>
        </ul>
      </Overlay>
    </transition>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { usePlayer } from '~/hooks/usePlayer'
import { DraggableEvent, ReorderPayload } from '~/types/Common'
import { AlbumTrackDTO } from '~/dto/AlbumTrackDTO'
import { VueDraggableNext } from 'vue-draggable-next'
import { secondsToMinutes } from '~/utils'
import PlayerRepeatTrack from './PlayerRepeatTrack.vue'
import PlayerPrevTrack from './PlayerPrevTrack.vue'
import PlayerNextTrack from './PlayerNextTrack.vue'
import PlayerPlayPause from './PlayerPlayPause.vue'
import PlayerProgressBar from './PlayerProgressBar.vue'
import PlayerCrackle from './PlayerCrackle.vue'
import PlayerSound from './PlayerSound.vue'
import PlayerExternal from './PlayerExternal.vue'
import PlayerList from './PlayerList.vue'
import Overlay from '../Overlay.vue'
import Sprite from '../Sprite/Sprite.vue'
import Button from '../Button.vue'

type PlayerKeyNav = 'Space' | 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown'

export default defineComponent({
  components: {
    PlayerRepeatTrack,
    PlayerPrevTrack,
    PlayerNextTrack,
    PlayerPlayPause,
    PlayerProgressBar,
    PlayerCrackle,
    PlayerSound,
    PlayerExternal,
    PlayerList,
    VueDraggableNext,
    Overlay,
    Sprite,
    Button
  },

  setup() {
    const {
      isPlayerExpanded,
      collapseExpandPlayer,
      currentPlaylistTracks,
      removeTrackFromPlaylist,
      playingTrack,
      switchToPrevTrack,
      switchToNextTrack,
      store
    } = usePlayer()
    const isPlaylistOpen = ref(false)
    const dragOptions = reactive({
      animation: 300,
      disabled: false
    })

    const trackTime = (duration: number) => secondsToMinutes(duration)
    const isPlaying = (id: string) => id === playingTrack.value._id

    const orderChanged = (event: DraggableEvent) => {
      const payload: ReorderPayload = {
        oldOrder: event.oldIndex,
        newOrder: event.newIndex,
        entityID: store.state.instance.currentPlaylist._id
      }

      store.commit('changePlaylistOrder', payload)
    }

    const playOrPause = () => {
      if (playingTrack.value.isOnPause) {
        store.commit('continuePlay')
      } else {
        store.commit('setTrackOnPause')
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

    const playTrack = (track: AlbumTrackDTO) => {
      store.dispatch('playTrack', track)
      store.commit('expandPlayer')
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

    const keyboardNavHandler = () => {
      document.addEventListener('keyup', (event) => {
        const keyCode = event.code as PlayerKeyNav
        const inputTags = ['TEXTAREA', 'INPUT', 'BUTTON']
        const isInputTags = inputTags.includes((event.target as HTMLInputElement).tagName)

        if (keyboardPlayerKeys[keyCode] && !isInputTags && playingTrack.value._id) {
          keyboardPlayerKeys[keyCode]()
        }
      })
    }

    const keyboardNavHandlerDestroy = () => {
      document.removeEventListener('keyup', keyboardNavHandler, false)
    }

    watch(
      playingTrack,
      (val) => console.log(val)
    )

    onMounted(() => keyboardNavHandler())
    onUnmounted(() => keyboardNavHandlerDestroy())

    return {
      isPlayerExpanded,
      collapseExpandPlayer,
      currentPlaylistTracks,
      togglePlaylistState,
      removeFromPlaylist,
      playTrack,
      trackTime,
      playingTrack,
      isPlaylistOpen,
      isPlaying,
      dragOptions,
      orderChanged
    }
  }
})

</script>

<style lang="scss">
@import '../../scss/variables.scss';
@import 'include-media';

.player {
  position: fixed;
  bottom: 0;
  z-index: 2000;

  @include media('<laptop') {
    left: 0;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    display: grid;
    width: 100vw;

    &.--expanded {
      height: 100vh;
      grid-template-columns: 100%;
      grid-template-rows: 73vh 27vh;

      @include media('landscape') {
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
        background: linear-gradient(to top left, $dark 50%, $accent 50%);
      }
    }

    &:not(.--expanded) {
      height: 60px;
      background-color: $dark;
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
            background: linear-gradient(to right, transparent 0%, $dark 100%);
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
        padding-right: 10px;

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

  @include media('>=laptop') {
    height: $playerHeight;
    display: flex;
    width: calc(100vw - #{$asideWidth});
    left: $asideWidth;
  }

  &.--z-low {
    z-index: 0;
  }

  &__left {
    flex: none;
    transition: all 0.3s $animation;

    @include media('<laptop') {
      position: relative;
      z-index: 100;
      padding-top: 70px;

      @include media('landscape') {
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
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
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
        background-color: $black;
        position: absolute;
        left: 50%;
        top: calc(50% - 30px);
        transform: translate(-50%, -50%);

        @include media('landscape') {
          top: calc(50% - -45px);
        }
      }
    }

    @include media('>=laptop') {
      background-color: $accent;
      position: absolute;
      left: 0;
      top: 0;
      width: $asideWidth;
      height: 100%;
      padding: 12px 15px 12px 25px;

      &:hover {
        min-width: $asideWidth;
        width: 100%;
        z-index: 20;
        transition: all 0.3s ease;
      }
    }

    &-content {

      @include media('<laptop') {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      @include media('>=laptop') {
        display: flex;
        align-items: center;
      }
    }
  }

  &__right {

    @include media('<laptop') {
      position: relative;
      z-index: 100;
      width: 100%;
      padding-bottom: 50px;
    }

    @include media('>=laptop') {
      background-color: $dark;
      width: calc(100% - #{$asideWidth});
      padding: 0 25px;
      margin-left: auto;
    }

    &-content {
      display: flex;
      align-items: center;
      height: 100%;

      @include media('<laptop') {
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  }

  &__cover {

    @include media('<laptop') {
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

    @include media('>=laptop') {
      width: 40px;
      height: 40px;
      border-radius: 3px;
      flex: none;
    }
  }

  &__title {
    color: $white;

    @include media('<laptop') {
      text-align: center;
      margin-top: auto;
      padding: 0 25px 40px;
    }

    @include media('>=laptop') {
      margin-left: 12px;
      width: calc(100% - 50px);
    }

    &-track {
      font-weight: 600;

      @include media('<laptop') {
        font-size: 20px;
        margin-bottom: 5px;
      }

      @include media('>=laptop') {
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    &-artist {

      @include media('<laptop') {
        font-size: 14px;
      }

      @include media('>=laptop') {
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

    @include media('<laptop') {
      display: none;
    }

    @include media('>=laptop') {
      display: flex;
      width: 15px;
      height: 15px;
      margin-right: 50px;
    }

    &.--mobile {

      @include media('<laptop') {
        display: flex;
        margin-right: 25px;
        width: 24px;
        height: 24px;
      }

      @include media('>=laptop') {
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
      background-color: $accent;
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
      color: $white;
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
      color: $white;
    }

    &[disabled] {
      opacity: 0.25;
      pointer-events: none;
    }
  }

  &__next {

    @include media('>=laptop') {
      margin-right: 50px;
    }
  }

  &__progress {
    display: flex;
    align-items: center;

    @include media('<laptop') {
      padding: 10px 25px;
      width: 100vw;
    }

    &-bar {
      appearance: none;
      background-color: $white;
      cursor: pointer;
      margin: 0 10px;
      border: 0;
      border-radius: 10px;

      @include media('<laptop') {
        flex: 1 1 0;
        height: 5px;
      }

      @include media('>=laptop') {
        width: 326px;
        height: 10px;
      }

      &::-webkit-progress-bar {
        border: 0;
        border-radius: 10px;

        @include media('<laptop') {
          height: 5px;
        }

        @include media('>=laptop') {
          height: 10px;
        }
      }

      &::-webkit-progress-value {
        background-color: $accent;
        border-radius: 5px;
      }
    }

    &-time {
      color: $white;
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

    @include media('>=laptop') {
      margin-left: auto;
    }

    .icon-vinyl {
      width: 24px;
      height: 24px;
      color: $white;
    }

    &.--active {

      .icon-vinyl {
        color: $accent;
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

    @include media('<laptop') {
      height: auto;
    }

    @include media('>=laptop') {
      height: 100%;
    }

    &:hover {
      overflow: inherit;

      .player__sound-range {
        opacity: 1;
        transform: translateX(0);
        transition: all 0.3s $animation;
      }
    }

    &-range {
      position: absolute;
      right: -10px;
      top: 0;
      height: 100%;
      padding: 0 40px 0 15px;
      background-color: $dark;
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
        background-color: $accent;
        width: 100%;
        height: 10px;
        border-radius: 10px;
      }

      &::-webkit-slider-thumb {
        width: 16px;
        height: 16px;
        background-color: $white;
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
        color: $white;
      }

      &.--muted {

        .icon {
          color: $accent;
        }
      }
    }

    .icon-sound {
      width: 22px;
      height: 22px;
      fill: $white;
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

    @include media('<laptop') {
      display: none;
    }

    @include media('>=laptop') {
      margin-left: 23px;
      width: 25px;
      height: 25px;
      cursor: pointer;
      border: 0;
      background-color: transparent;
      padding: 0;

      .icon {
        width: 24px;
        color: $white;
      }
    }
  }

  .overlay {
    width: 100vw;
    max-width: 777px;
    right: 0;
    bottom: $playerHeight;
    background-color: $transBlack;
    height: calc(100vh - #{$playerHeight});
    overflow: auto;
    border-radius: 0;
    transition: all 0.5s $animation;

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
        align-items: flex-start;
        padding-right: 0;

        img {
          width: inherit;
          height: inherit;
          object-fit: cover;
          border-radius: $borderRadiusSM;
          max-height: 100%;
          display: block;
        }

        strong {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          font-size: 0.875rem;
          color: $paleMD;
          transition: all 0.2s $animation;
        }

        span {
          font-size: 0.75rem;
          color: $paleDP;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          transition: all 0.2s $animation;
        }

        time {
          margin-left: auto;
          color: $paleDP;
          font-size: 0.875rem;
          transition: all 0.2s $animation;
        }

        .button {
          position: relative;
          top: -2px;
          color: $paleDP;
        }

        &.--active,
        &:hover {
          background-color: transparent;

          strong {
            color: $white;
            transition: all 0.2s $animation;
          }

          span,
          time {
            color: $paleLT;
            transition: all 0.2s $animation;
          }
        }
      }

      &-cover {
        position: relative;
        width: 40px;
        height: 40px;
        margin: 0.25rem 0.875rem 0 0;

        .playing {
          position: absolute;
          width: 25px;
          height: 25px;
          z-index: 10;
          fill: $white;
          color: $white;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }

      &-info {
        line-height: 1.2;
        display: flex;
        flex-direction: column;
        width: calc(100% - 110px);
        padding-right: 1rem;
      }
    }
  }
}
</style>
