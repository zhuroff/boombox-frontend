<template>
<section :class="[{ '--expanded': isPlayerExpanded }, 'player']">
  <div
    class="player__left"
    @click="collapseExpandPlayer"
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
  </div>
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
            v-for="track in currentPlaylistTracks"
            :class="[{ '--active' : isPlaying(track._id) }, 'overlay__list-item']"
            :key="track._id"
            @click="() => playTrack(track)"
          >
            <div class="overlay__list-cover">
              <img :src="track.albumCover" />
              <Sprite v-if="isPlaying(track._id)" name="playing" />
            </div>
            <div class="overlay__list-info">
              <strong>{{ track.order }} - {{ track.title }}</strong>
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

import { defineComponent, onMounted, onUnmounted, reactive, ref } from 'vue'
import { usePlayer } from '~/hooks/usePlayer'
import { DraggableEvent, ReorderPayload } from '~/types/Global'
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
import './Player.scss'

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
