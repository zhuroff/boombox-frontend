<template>
  <div class="tracklist">
    <VueDraggableNext
      handle=".--drag"
      v-bind="dragOptions"
      @end="orderChanged"
    >
      <transition-group>
        <TrackListRow
          v-for="(track, index) in albumTracksOnly"
          :key="track._id"
          :track="track"
          :isTOY="isTOY"
          :index="index"
          :albumID="albumID"
          @saveToyInfo="saveToyInfo"
        />
      </transition-group>
    </VueDraggableNext>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType, computed } from 'vue'
import { DraggableEvent, ReorderPayload } from '~/types/Common'
import { VueDraggableNext } from 'vue-draggable-next'
import store from '~/store'
import AlbumTrack from '~/classes/AlbumTrack'
import TrackListRow from './TrackListRow.vue'

export default defineComponent({
  name: 'TrackList',
  components: {
    VueDraggableNext,
    TrackListRow
  },
  props: {
    tracks: {
      type: Array as PropType<AlbumTrack[]>,
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
    const { actions } = store

    const dragOptions = reactive({
      animation: 300,
      disabled: false
    })

    const albumTracksOnly = computed(() => (
      props.tracks.filter(({ isOutOfAlbumList }) => !isOutOfAlbumList)
    ))

    const orderChanged = (event: DraggableEvent) => {
      const payload: ReorderPayload = {
        oldOrder: event.oldIndex,
        newOrder: event.newIndex,
        entityID: props.albumID
      }

      actions.changePlaylistOrder(payload)

      if (props.isPlaylist) {
        emit('orderChanged', payload)
      }
    }

    const saveToyInfo = (payload: any) => emit('saveToyInfo', payload)

    return {
      dragOptions,
      orderChanged,
      saveToyInfo,
      albumTracksOnly
    }
  }
})
</script>

<style lang="scss">
@import '~/scss/variables';
@import 'include-media';

.tracklist {
  margin: 75px 0 25px;
}
</style>
