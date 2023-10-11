<template>
  <div>
    <div :class="[
      { '--playing': isPlayingTrack },
      { '--disabled': track.isDisabled },
      'tracklist__row'
    ]">
      <div class="tracklist__row-cell --drag">
        <button class="tracklist__row-action">
          <Sprite name="burger" />
        </button>
      </div>
      <div class="tracklist__row-cell --order">
        {{ track.order || index + 1 }}
      </div>
      <TrackItemPlay
        :track="track"
        :index="index"
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
      <div class="tracklist__row-cell --pointer --fix">
        <button
          class="tracklist__row-action"
          @click="isTOYEditable = !isTOYEditable"
        >
          <!-- <Sprite name="disable" /> -->!
        </button>
      </div>
      <div
        v-if="!isTOY"
        class="tracklist__row-cell --fix"
      >{{ track.listened }}</div>
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
    <!-- <div v-if="isTOY && isTOYEditable">
      <Editor
        v-model="descriptionValue"
        editorStyle="height: 150px"
      >
        <template #toolbar>
          <span class="ql-formats">
            <button class="ql-bold"></button>
            <button class="ql-italic"></button>
            <button class="ql-link"></button>
          </span>
        </template>
      </Editor>
      <Textarea
        v-model="frameValue"
        :autoResize="true"
        rows="5"
        cols="30"
        :style="{ width: '100%' }"
      />
      <button @click="saveToyInfo">Save</button>
    </div> -->
  </div>
</template>

<script lang="ts">

import { defineComponent, ref, computed, PropType } from 'vue'
import { useStore } from 'vuex'
import { key } from '~/store'
import { AlbumTrackDTO } from '~/dto/AlbumTrackDTO'
import Sprite from '~/components/Sprite/Sprite.vue'
import TrackItemPlay from './TrackItemPlay.vue'
import TrackItemTitle from './TrackItemTitle.vue'
import TrackItemDuration from './TrackItemDuration.vue'
import TrackItemPlaylist from './TrackItemPlaylist.vue'
import TrackItemDisable from './TrackItemDisable.vue'
import Modal from '~/components/Modal/Modal.vue'
import TrackLyrics from './TrackLyrics.vue'
import Editor from 'primevue/editor';
import Textarea from 'primevue/textarea';

export default defineComponent({
  components: {
    Sprite,
    TrackItemPlay,
    TrackItemTitle,
    TrackItemDuration,
    TrackItemPlaylist,
    TrackItemDisable,
    Modal,
    TrackLyrics,
    Editor,
    Textarea
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
    display: grid;
    grid-auto-flow: column;
    justify-content: flex-start;
    grid-template-columns: repeat(3, auto) 1fr;

    &:hover {
      background-color: $dark;
      color: $white;
    }

    &-cell {
      display: flex;
      align-items: center;
      position: relative;
  
      &.--order {
        width: 20px;
        flex: none;
        line-height: 1;
        justify-content: flex-end;
      }
  
      &.--drag {
        flex: none;
        justify-content: flex-start;

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
  
      &.--disabled {
        pointer-events: none;
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
        color: $pale;
        transition: fill 0.2s ease;
      }
  
      &:hover {
  
        .icon {
          color: inherit;
          transition: fill 0.2s ease;
        }
      }
    }

    &.--playing {
      background-color: $white;
      color: $dark;
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
