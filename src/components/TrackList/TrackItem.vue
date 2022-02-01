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
    @callLyricsModal="callLyricsModal"
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
  
  <!-- <transition name="fade">
    <AppModal
      v-if="isModalActive"
      :isModalActive="isModalActive"
      @closeModalForm="closeModalForm"
    >
      <AppLyrics
        :lyrics="track.lyrics || ''"
        :heading="trackTitle"
        @saveLyrics="saveLyrics"
      />
    </AppModal>
  </transition> -->
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
// import AppModal from '@/components/AppModal.vue'
// import AppLyrics from '@/components/AppLyrics.vue'

export default defineComponent({
  components: {
    AppSprite,
    TrackItemPlay,
    TrackItemTitle,
    TrackItemDuration,
    // TrackItemRemove,
    TrackItemPlaylist,
    TrackItemDisable,
    // AppModal,
    // AppLyrics
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

  setup(props, { emit }) {
    const store = useStore(key)
    const isModalActive = ref(false)

    const isPlayingTrack = computed(() => (
      store.getters.playingTrack.fileid === props.track.fileid
    ))
    const callLyricsModal = () => {
      isModalActive.value = true
    }

    // const closeModalForm = () => {
    //   isModalActive.value = false
    // }

    // const removeTrackFromPlaylist = (payload) => {
    //   emit('removeTrackFromPlaylist', {
    //     ...payload,
    //     itemID: props.track.trackID,
    //     isSave: false
    //   })
    // }

    // const saveLyrics = (lyrics) => {
    //   const payload = {
    //     lyrics,
    //     fileid: props.track.fileid
    //   }

    //   emit('saveLyrics', payload)
    // }

    return {
      isModalActive,
      isPlayingTrack,
      callLyricsModal,
      // closeModalForm,
      // removeTrackFromPlaylist,
      // saveLyrics
    }
  }
})

</script>
