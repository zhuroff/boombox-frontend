<template>
  <div>
    <div :class="[
      { '--playing': isPlayingTrack },
      // { '--disabled': track.isDisabled },
      'tracklist__row'
    ]">
      <div class="tracklist__row-cell --drag">
        <Button
          icon="drag"
          size="small"
          isText
          className="tracklist__row-action"
        />
      </div>
      <div class="tracklist__row-cell --order">
        <!-- {{ track.order || index + 1 }} -->
        {{ index + 1 }}
      </div>
      <TrackItemAdd
        v-if="isNotCurrentPlaylist"
        :track="track"
      />
      <TrackItemPlay
        :track="track"
        :isTOY="isTOY"
      />
      <TrackItemTitle
        :title="track.title"
        :id="track._id"
        @callLyricsModal="lyricsModalSwitcher"
      />
      <TrackItemDuration
        v-if="!isTOY"
        :duration="track.duration"
      />
      <TrackItemCompilation
        v-if="isAdmin && !isTOY"
        :trackID="track._id"
        :isCompilation="isCompilation"
        @removeTrackFromCompilation="() => $emit('removeTrackFromCompilation', track._id)"
      />
      <TrackItemDisable :fileid="track._id" />
      <div
        v-if="!isTOY"
        class="tracklist__row-cell --fix"
      >{{ track.listened }}</div>
    </div>
    <transition name="fade">
      <Modal
        v-if="isModalActive"
        :isModalActive="isModalActive"
        @closeModal="lyricsModalSwitcher"
      >
        <TrackLyrics
          :heading="trackArtistAndTitle"
          :track="track"
        />
      </Modal>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import useGlobalStore from '~/store/global'
import usePlaylist from '~/store/playlist'
import Button from '~/components/Button.vue'
import TrackItemAdd from './TrackItemAdd.vue'
import TrackItemPlay from './TrackItemPlay.vue'
import TrackItemTitle from './TrackItemTitle.vue'
import TrackItemDuration from './TrackItemDuration.vue'
import TrackItemCompilation from './TrackItemCompilation.vue'
import TrackItemDisable from './TrackItemDisable.vue'
import Modal from '~/components/Modal.vue'
import TrackLyrics from './TrackLyrics.vue'

interface Props {
  track: Track
  index: number
  albumID: string
  isCompilation: boolean
  isTOY: boolean
}

const props = defineProps<Props>()

const {
  globalGetters: { authConfig }
} = useGlobalStore()

const {
  playerGetters: { playingTrack, currentPlaylist }
} = usePlaylist()

const isModalActive = ref(false)
const isTOYEditable = ref(false)

const trackArtistAndTitle = computed(() => (
  `${props.track.artist.title} - ${props.track.title}`
))

const isPlayingTrack = computed(() => (
  playingTrack.value?._id === props.track._id
))

const isNotCurrentPlaylist = computed(() => (
  // @ts-expect-error: fix
  currentPlaylist.value?._id && props.albumID !== currentPlaylist.value._id
))

const isAdmin = computed(() => (
  authConfig.value.user?.role === 'admin'
))

const lyricsModalSwitcher = () => {
  isModalActive.value = !isModalActive.value
}
</script>

<style lang="scss">
@use '~/scss/variables' as var;

.tracklist {

  &__row {
    color: var.$black;
    height: 3rem;
    display: flex;

    &:hover {
      border-radius: var.$borderRadiusSM;
      background-color: var.$dark;
      color: var.$white;
    }

    &-cell {
      display: flex;
      align-items: center;
      position: relative;
  
      &.--order {
        width: 25px;
        flex: none;
        line-height: 1;
        justify-content: center;
      }
  
      &.--drag {
        flex: none;
        justify-content: flex-start;

        .icon {
          color: var.$paleDP;
          fill: var.$paleDP;
        }

        @include var.media('<laptop') {
          display: none;
        }

        @include var.media('>=laptop') {
          width: 30px;
        }
        
        * {
          cursor: move;
        }
      }
  
      &.--fix {
        flex: none;
        justify-content: center;

        @include var.media('<laptop') {
          width: 40px;
        }

        @include var.media('>=laptop') {
          width: 50px;
        }
      }
  
      &.--pointer {
        cursor: pointer;
      }

      &.--title {

        @include var.media('<laptop') {
          padding-left: 0;
          margin-right: 5px;
        }
      }

      &.--duration {

        @include var.media('<laptop') {
          display: none;
        }
      }

      &.--compilation {
       
        @include var.media('<laptop') {
          display: none;
        }
      }

      &:last-child {

        @include var.media('<laptop') {
          display: none;
        }
      }
    }

    &-action {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      border: 0;

      @include var.media('<laptop') {
        padding: 0;
      }
  
      .icon {
        width: 18px;
        height: 18px;
        color: var.$paleDP;
        fill: var.$paleDP;
        transition: fill 0.2s ease;
      }
  
      &:hover {
  
        .icon {
          color: var.$white;
          fill: var.$white;
          transition: fill 0.2s ease;
        }
      }
    }

    &.--playing {
      background-color: var.$dark;
      color: var.$white;
      border-radius: var.$borderRadiusSM;

      .icon {

        &.playing,
        &.spinner,
        &.drag,
        &.plus {
          fill: var.$white;
          color: var.$white;
        }

        &.spinner {
          stroke: var.$white;
        }
      }
    }
  
    &.--disabled {
      
      & > *:not(:nth-last-child(2)) {
        opacity: 0.25;
        pointer-events: none;
      }
    }
  }
}
</style>
