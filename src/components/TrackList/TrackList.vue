<template>
  
<div
  v-if="album.tracks.length"
  class="wrapper"
>
  <div class="tracklist">
    <VueDraggableNext
      handle=".--drag"
      v-bind="dragOptions"
      @end="orderChanged"
    >
      <transition-group>
        <TrackItem
          v-for="(track, index) in album.tracks"
          :key="track.fileid"
          :track="{ ...track, artist: { title: !album.isPlaylist ? album.artist.title : track.artist.title } }"
          :index="index"
          :isPlaylist="album.isPlaylist"
          @playTrack="playTrack"
          @createNewList="createPlaylist"
          @removeTrackFromPlaylist="playlistAction"
          @itemAction="playlistAction"
          @disableTrack="disableTrack"
          @saveLyrics="saveLyrics"
        />
      </transition-group>
    </VueDraggableNext>
  </div>
</div>

<div
  v-else
  class="wrapper --placeholder"
></div>

</template>

<script>

import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import { VueDraggableNext } from 'vue-draggable-next'
import TrackItem from './TrackItem.vue'

export default {
  components: {
    VueDraggableNext,
    TrackItem
  },

  props: {
    album: {
      type: Object,
      required: true
    }
  },

  setup(props, { emit }) {
    const store = useStore()

    const dragOptions = reactive({
      animation: 300,
      disabled: false
    })

    const orderChanged = (event) => {
      const payload = {
        oldOrder: event.oldIndex,
        newOrder: event.newIndex
      }

      emit('changeTracksOrder', payload)
    }

    const playTrack = (payload) => {
      store.dispatch('playTrack', { ...payload, playlist: props.album })
    }

    const createPlaylist = (data) => {
      const payload = {
        title: data.title,
        tracks: [{
          track: data.id,
          fileid: data.fileid,
          artist: props.album.artist._id,
          album: props.album._id,
          order: 1
        }]
      }

      store.dispatch('createPlaylist', payload)
    }

    const playlistAction = async (data) => {
      const payload = {
        ...data,
        artist: props.album.artist?._id,
        album: props.album._id
      }

      await axios.patch(`/api/playlists/${payload.listID}`, payload)

      if (props.album.isPlaylist) {
        store.dispatch('fetchPlaylist', payload.listID)
      }
    }

    const disableTrack = (payload) => {
      store.commit('disableTrack', payload)
    }

    const saveLyrics = async (payload) => {
      emit('saveLyrics', payload)
    }

    return {
      dragOptions,
      orderChanged,
      playTrack,
      createPlaylist,
      playlistAction,
      disableTrack,
      saveLyrics
    }
  }
}

</script>

<style lang="scss" scoped>

@import '@/scss/variables';

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.wrapper {
  margin: 20px 0;

  &.--placeholder {
    height: 260px;
    background: repeating-linear-gradient(-45deg, transparent, transparent 15px, $border 15px, $border 30px);
    background-size: 150% 150%;
    animation: placeholder 5s linear infinite;
  }
}

</style>
