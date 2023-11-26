<template>
  <div>
    <div :class="[
      { '--playing': isPlayingTrack },
      { '--disabled': track.isDisabled },
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
        {{ track.order || index + 1 }}
      </div>
      <TrackItemAdd
        v-if="isNotCurrentPlaylist"
        :track="track"
      />
      <TrackItemPlay
        :track="track"
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
      <TrackItemPlaylist
        v-if="!isTOY"
        :trackID="track._id"
      />
      <TrackItemDisable :fileid="track._id" />
      <!-- <div class="tracklist__row-cell --pointer --fix">
        <button
          class="tracklist__row-action"
          @click="isTOYEditable = !isTOYEditable"
        >
          <Sprite name="disable" />
        </button>
      </div> -->
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
            :id="track._id"
          />
        </Modal>
      </transition>
  </div>
</template>

<script lang="ts">

import { defineComponent, ref, computed, PropType } from 'vue'
import { useStore } from 'vuex'
import { key } from '~/store'
import { AlbumTrackDTO } from '~/dto/AlbumTrackDTO'
import Button from '~/components/Button.vue'
import TrackItemAdd from './TrackItemAdd.vue'
import TrackItemPlay from './TrackItemPlay.vue'
import TrackItemTitle from './TrackItemTitle.vue'
import TrackItemDuration from './TrackItemDuration.vue'
import TrackItemPlaylist from './TrackItemPlaylist.vue'
import TrackItemDisable from './TrackItemDisable.vue'
import Modal from '~/components/Modal.vue'
import TrackLyrics from './TrackLyrics.vue'

export default defineComponent({
  name: 'TrackListRow',
  components: {
    Button,
    TrackItemAdd,
    TrackItemPlay,
    TrackItemTitle,
    TrackItemDuration,
    TrackItemPlaylist,
    TrackItemDisable,
    Modal,
    TrackLyrics
  },
  props: {
    track: {
      type: Object as PropType<AlbumTrackDTO>,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    albumID: {
      type: String,
      required: true
    },
    isTOY: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
    const store = useStore(key)
    const descriptionValue = ref('')
    const frameValue = ref('')
    const isModalActive = ref(false)
    const isTOYEditable = ref(false)

    const trackArtistAndTitle = computed(() => (
      `${props.track.artist.title} - ${props.track.title}`
    ))

    const isPlayingTrack = computed(() => (
      store.getters.playingTrack._id === props.track._id
    ))

    const isNotCurrentPlaylist = computed(() => (
      props.albumID !== store.state.instance.currentPlaylist._id
    ))

    const lyricsModalSwitcher = () => {
      isModalActive.value = !isModalActive.value
    }

    const saveToyInfo = () => {
      emit('saveToyInfo', {
        trackId: props.track._id.replace(/[^a-z0-9]+/g, ''),
        description: descriptionValue.value,
        iframe: frameValue.value
      })
    }

    return {
      isModalActive,
      isPlayingTrack,
      lyricsModalSwitcher,
      isNotCurrentPlaylist,
      trackArtistAndTitle,
      isTOYEditable,
      descriptionValue,
      frameValue,
      saveToyInfo
    }
  }
})

</script>

<style lang="scss">
@import '~/scss/variables';
@import 'include-media';

.tracklist {
  margin: 20px 0;

  &__row {
    font-size: 1rem;
    color: $black;
    height: 3rem;
    display: flex;

    &:hover {
      border-radius: $borderRadiusSM;
      background-color: $dark;
      color: $white;
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
          color: $paleDP;
          fill: $paleDP;
        }

        @include media('<laptop') {
          width: 18px;
        }

        @include media('>=laptop') {
          width: 30px;
        }
        
        * {
          cursor: move;
        }
      }
  
      &.--fix {
        flex: none;
        justify-content: center;

        @include media('<laptop') {
          width: 40px;
        }

        @include media('>=laptop') {
          width: 50px;
        }
      }
  
      &.--pointer {
        cursor: pointer;
      }

      &.--title {

        @include media('<laptop') {
          padding-left: 0;
          margin-right: 5px;
        }
      }

      &.--duration {

        @include media('<laptop') {
          display: none;
        }
      }

      &:last-child {

        @include media('<laptop') {
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

      @include media('<laptop') {
        padding: 0;
      }
  
      .icon {
        width: 18px;
        height: 18px;
        color: $paleDP;
        transition: fill 0.2s ease;
      }
  
      &:hover {
  
        .icon {
          color: $white;
          fill: $white;
          transition: fill 0.2s ease;
        }
      }
    }

    &.--playing {
      background-color: $dark;
      color: $white;
      border-radius: $borderRadiusSM;

      .icon {

        &.playing,
        &.spinner,
        &.drag,
        &.plus {
          fill: $white;
          color: $white;
        }

        &.spinner {
          stroke: $white;
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
