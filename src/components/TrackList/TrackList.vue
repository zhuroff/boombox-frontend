<template>  
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
        />
      </transition-group>
    </VueDraggableNext>
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
import './TrackList.scss'

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

    return {
      dragOptions,
      orderChanged
    }
  }
})

</script>
