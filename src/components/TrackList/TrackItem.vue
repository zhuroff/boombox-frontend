<template>
  
<div :class="[
  { '--playing' : isPlayingTrack },
  { '--disabled' : track.isDisabled },
  'tracklist__row'
]">
  <div class="tracklist__row_cell --drag">
    <AppSprite name="burger" />
  </div>

  <div class="tracklist__row_cell --order">
    {{ track.order || index + 1 }}
  </div>

  <TrackItemPlay
    :fileid="track.fileid"
    :index="index"
    @playTrack="playTrack"
  />

  <TrackItemTitle
    :title="trackTitle"
    @callLyricsModal="callLyricsModal"
  />

  <TrackItemDuration :duration="track.duration" />

  <TrackItemRemove
    v-if="isPlaylist"
    @removeTrackFromPlaylist="removeTrackFromPlaylist"
  />

  <TrackItemPlaylist
    v-else
    :trackID="track._id"
    @createNewList="createNewList"
    @itemAction="itemAction"
  />

  <TrackItemDisable @disableTrack="disableTrack" />

  <div class="tracklist__row_cell --fix">
    {{ track.listened }}
  </div>
  
  <transition name="fade">
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
  </transition>
</div>

</template>

<script>

import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import AppSprite from '@/components/AppSprite.vue'
import TrackItemPlay from './TrackItemPlay.vue'
import TrackItemTitle from './TrackItemTitle.vue'
import TrackItemDuration from './TrackItemDuration.vue'
import TrackItemRemove from './TrackItemRemove.vue'
import TrackItemPlaylist from './TrackItemPlaylist.vue'
import TrackItemDisable from './TrackItemDisable.vue'
import AppModal from '@/components/AppModal.vue'
import AppLyrics from '@/components/AppLyrics.vue'

export default {
  components: {
    AppSprite,
    TrackItemPlay,
    TrackItemTitle,
    TrackItemDuration,
    TrackItemRemove,
    TrackItemPlaylist,
    TrackItemDisable,
    AppModal,
    AppLyrics
  },

  props: {
    track: {
      type: Object,
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
    const store = useStore()
    const isModalActive = ref(false)

    const isPlayingTrack = computed(() => (
      store.getters.playingTrack
      && store.getters.playingTrack.fileid === props.track.fileid
    ))

    const trackTitle = computed(() => {
      if (!props.isPlaylist && !isModalActive.value) {
        return props.track.title
      }

      return `${props.track.artist.title} - ${props.track.track || props.track.title}`
    })

    const createNewList = (title) => {
      emit('createNewList', {
        title,
        id: props.track._id,
        fileid: props.track.fileid
      })
    }

    const playTrack = () => {
      const payload = {
        order: props.track.order || props.index,
        fileid: props.track.fileid,
        link: props.track.link,
        duration: props.track.duration
      }

      emit('playTrack', payload)
    }

    const callLyricsModal = () => {
      isModalActive.value = true
    }

    const closeModalForm = () => {
      isModalActive.value = false
    }

    const removeTrackFromPlaylist = (payload) => {
      emit('removeTrackFromPlaylist', {
        ...payload,
        itemID: props.track.trackID,
        isSave: false
      })
    }

    const itemAction = (payload) => {
      emit('itemAction', {
        ...payload,
        fileid: props.track.fileid
      })
    }

    const disableTrack = () => {
      emit('disableTrack', { trackID: props.track._id })
    }

    const saveLyrics = (lyrics) => {
      const payload = {
        lyrics,
        fileid: props.track.fileid
      }

      emit('saveLyrics', payload)
    }

    return {
      isModalActive,
      isPlayingTrack,
      trackTitle,
      createNewList,
      playTrack,
      callLyricsModal,
      closeModalForm,
      removeTrackFromPlaylist,
      itemAction,
      disableTrack,
      saveLyrics
    }
  }
}

</script>

<style lang="scss" scoped>

@import '@/scss/variables';

.tracklist__row {
  font-weight: 600;
  font-size: 12px;
  color: $pale;
  height: 40px;
  display: flex;

  &_cell {
    display: flex;
    align-items: center;

    &.--order {
      width: 20px;
      flex: none;
    }

    &.--drag {
      width: 30px;
      flex: none;
      justify-content: flex-start;
      cursor: move;

      .icon-burger {
        width: 12px;
        height: 12px;
        fill: $pale;
        transition: fill 0.2s ease;
        position: relative;
        top: 1px;
      }
    }

    &.--fix {
      width: 50px;
      flex: none;
      justify-content: center;
    }

    &.--pointer {
      cursor: pointer;
    }

    &.--disabled {
      pointer-events: none;
    }
  }

  &.--playing {
    background-color: $white;
    color: $dark;

    &.--drag {

      .icon-burger {
        fill: $dark;
        transition: fill 0.2s ease;
      }
    }
  }

  &.--disabled {
    
    & > *:not(:nth-last-child(2)) {
      opacity: 0.25;
      pointer-events: none;
    }
  }

  &.sortable-chosen {
    background-color: $border;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    border-radius: 3px;
  }
}

</style>
