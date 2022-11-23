<template>
  <div>
    <div :class="[
      { '--playing': isPlayingTrack },
      { '--disabled': track.isDisabled },
      'tracklist__row'
    ]">
      <div class="tracklist__row_cell --drag">
        <button class="tracklist__row_action">
          <Sprite name="burger" />
        </button>
      </div>

      <div class="tracklist__row_cell --order">
        {{ track.order || index + 1 }}
      </div>

      <TrackItemPlay :fileid="track._id" :trackid="track._id" :index="index" />

      <TrackItemTitle :title="track.title" :id="track._id" @callLyricsModal="lyricsModalSwitcher" />

      <TrackItemDuration v-if="!isTOY" :duration="track.duration" />

      <TrackItemPlaylist v-if="!isTOY" :trackID="track._id" />

      <TrackItemDisable :fileid="track._id" />

      <div class="tracklist__row_cell --pointer --fix">
        <button class="tracklist__row_action" @click="isTOYEditable = !isTOYEditable">
          <!-- <Sprite name="disable" /> -->!
        </button>
      </div>

      <div class="tracklist__row_cell --fix" v-if="!isTOY">
        {{ track.listened }}
      </div>

      <transition name="fade">
        <Modal v-if="isModalActive" :isModalActive="isModalActive" @closeModal="lyricsModalSwitcher">
          <TrackLyrics :heading="trackArtistAndTitle" :id="track._id" />
        </Modal>
      </transition>
    </div>
    <div v-if="isTOY && isTOYEditable">
      <Editor v-model="descriptionValue" editorStyle="height: 150px">
        <template #toolbar>
          <span class="ql-formats">
            <button class="ql-bold"></button>
            <button class="ql-italic"></button>
            <button class="ql-link"></button>
          </span>
        </template>
      </Editor>
      <Textarea v-model="frameValue" :autoResize="true" rows="5" cols="30" :style="{ width: '100%' }" />
      <button @click="saveToyInfo">Save</button>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { key } from '~/store'
import { Track } from '~/types/Track'
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
      type: Object as () => Track,
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
