<template>
  
<div :class="[
  { '--playing' : isPlayingTrack },
  { '--disabled' : track.isDisabled },
  'tracklist__row'
]">
  <div class="tracklist__row_cell --drag">
    <button class="tracklist__row_action">
      <AppSprite name="burger" />
    </button>
  </div>

  <div class="tracklist__row_cell --order">
    {{ track.order || index + 1 }}
  </div>

  <TrackItemPlay
    :fileid="track.fileid"
    :trackid="track._id"
    :index="index"
  />

  <TrackItemTitle
    :title="track.title"
    :id="track._id"
    @callLyricsModal="lyricsModalSwitcher"
  />

  <TrackItemDuration :duration="track.duration" />

  <TrackItemPlaylist
    v-if="!isPlaylist"
    :trackID="track._id"
  />

  <!-- <TrackItemRemove
    v-else
    @removeTrackFromPlaylist="removeTrackFromPlaylist"
  /> -->

  <TrackItemDisable :fileid="track.fileid" />

  <div class="tracklist__row_cell --fix">
    {{ track.listened }}
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

import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { key } from '~/store'
import { IAlbumTrack } from '~/types/Album'
import AppSprite from '~/components/AppSprite.vue'
import TrackItemPlay from './TrackItemPlay.vue'
import TrackItemTitle from './TrackItemTitle.vue'
import TrackItemDuration from './TrackItemDuration.vue'
// import TrackItemRemove from './TrackItemRemove.vue'
import TrackItemPlaylist from './TrackItemPlaylist.vue'
import TrackItemDisable from './TrackItemDisable.vue'
import Modal from '~/components/Modal/Modal.vue'
import TrackLyrics from './TrackLyrics.vue'

export default defineComponent({
  components: {
    AppSprite,
    TrackItemPlay,
    TrackItemTitle,
    TrackItemDuration,
    // TrackItemRemove,
    TrackItemPlaylist,
    TrackItemDisable,
    Modal,
    TrackLyrics
  },

  props: {
    track: {
      type: Object as () => IAlbumTrack,
      required: true
    },

    index: {
      type: Number,
      required: true
    },

    isPlaylist: {
      required: false
    }
  },

  setup(props) {
    const store = useStore(key)

    const isModalActive = ref(false)

    const trackArtistAndTitle = computed(() => (
      `${props.track.artist.title} - ${props.track.title}`
    ))

    const isPlayingTrack = computed(() => (
      store.getters.playingTrack.fileid === props.track.fileid
    ))

    const lyricsModalSwitcher = () => {
      isModalActive.value = !isModalActive.value
    }

    // const removeTrackFromPlaylist = (payload) => {
    //   emit('removeTrackFromPlaylist', {
    //     ...payload,
    //     itemID: props.track.trackID,
    //     isSave: false
    //   })
    // }

    return {
      isModalActive,
      isPlayingTrack,
      lyricsModalSwitcher,
      // removeTrackFromPlaylist,
      trackArtistAndTitle
    }
  }
})

</script>
