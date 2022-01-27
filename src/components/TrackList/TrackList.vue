<template>
  
<div class="wrapper">
  <div class="tracklist">
    <VueDraggableNext
      handle=".--drag"
      v-bind="dragOptions"
      @end="orderChanged"
    >
      <transition-group>
        <TrackItem
          v-for="(track, index) in tracks"
          :key="track.fileid"
          :track="track"
          :index="index"
          :isPlaylist="false"
          @createNewList="createPlaylist"
          @removeTrackFromPlaylist="playlistAction"
          @itemAction="playlistAction"
          @saveLyrics="saveLyrics"
        />
      </transition-group>
    </VueDraggableNext>
  </div>
</div>

</template>

<script lang="ts">

import { defineComponent, reactive } from 'vue'
import { useStore } from 'vuex'
import { key } from '~/store'
import { IAlbumTrack } from '~/types/Album'
import { IOrderPayload } from '~/types/Player'
import { IDraggableEvent } from '~/types/Global'
import { VueDraggableNext } from 'vue-draggable-next'
import TrackItem from './TrackItem.vue'

export default defineComponent({
  components: {
    VueDraggableNext,
    TrackItem
  },

  props: {
    tracks: {
      type: Array as () => IAlbumTrack[],
      required: true
    },

    albumID: {
      type: String,
      required: true
    }
  },

  setup(props, { emit }) {
    const store = useStore(key)

    const dragOptions = reactive({
      animation: 300,
      disabled: false
    })

    const orderChanged = (event: IDraggableEvent) => {
      const payload: IOrderPayload = {
        oldOrder: event.oldIndex,
        newOrder: event.newIndex,
        playlistID: props.albumID
      }

      store.commit('changePlaylistOrder', payload)
    }

    const createPlaylist = (data: any) => {
      console.log(data)
      // const payload = {
      //   title: data.title,
      //   tracks: [{
      //     track: data.id,
      //     fileid: data.fileid,
      //     artist: props.album.artist._id,
      //     album: props.album._id,
      //     order: 1
      //   }]
      // }

      // store.dispatch('createPlaylist', payload)
    }

    const playlistAction = async (data: any) => {
      console.log(data)
      // const payload = {
      //   ...data,
      //   artist: props.album.artist?._id,
      //   album: props.album._id
      // }

      // await axios.patch(`/api/playlists/${payload.listID}`, payload)

      // if (props.album.isPlaylist) {
      //   store.dispatch('fetchPlaylist', payload.listID)
      // }
    }

    const saveLyrics = async (payload: any) => {
      console.log(payload)
      // emit('saveLyrics', payload)
    }

    return {
      dragOptions,
      orderChanged,
      createPlaylist,
      playlistAction,
      saveLyrics
    }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';

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