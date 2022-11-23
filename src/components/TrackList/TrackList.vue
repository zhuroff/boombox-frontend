<template>
  <div class="tracklist">
    <VueDraggableNext handle=".--drag" v-bind="dragOptions" @end="orderChanged">
      <transition-group>
        <TrackItem v-for="(track, index) in tracks" :key="track._id" :track="track" :isTOY="isTOY" :index="index"
          @saveToyInfo="saveToyInfo" />
      </transition-group>
    </VueDraggableNext>
  </div>
</template>

<script lang="ts">

import { defineComponent, reactive } from 'vue'
import { useStore } from 'vuex'
import { key } from '~/store'
import { Track } from '~/types/Track'
import { DraggableEvent, ReorderPayload } from '~/types/Global'
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
      type: Array as () => Track[],
      required: true
    },

    albumID: {
      type: String,
      required: true
    },

    isPlaylist: {
      type: Boolean,
      required: false,
      default: false
    },

    isTOY: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  setup(props, { emit }) {
    const store = useStore(key)

    const dragOptions = reactive({
      animation: 300,
      disabled: false
    })

    const orderChanged = (event: DraggableEvent) => {
      const payload: ReorderPayload = {
        oldOrder: event.oldIndex,
        newOrder: event.newIndex,
        entityID: props.albumID
      }

      store.commit('changePlaylistOrder', payload)

      if (props.isPlaylist) {
        emit('orderChanged', payload)
      }
    }

    const saveToyInfo = (payload: any) => emit('saveToyInfo', payload)

    return {
      dragOptions,
      orderChanged,
      saveToyInfo
    }
  }
})

</script>
