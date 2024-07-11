<template>
  <div class="tracklist">
    <VueDraggableNext
      handle=".--drag"
      v-bind="dragOptions"
      @end="orderChanged"
    >
      <TrackListRow
        v-for="(track, index) in albumTracksOnly"
        :key="track._id"
        :track="track"
        :isTOY="isTOY"
        :index="index"
        :albumID="albumID"
        :isCompilation="isCompilation"
        @removeTrackFromCompilation="removeTrackFromCompilation"
      />
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
    isCompilation: {
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

      if (props.isCompilation) {
        emit('trackOrderChanged', payload)
      }
    }

    const removeTrackFromCompilation = (trackID: string) => {
      emit('removeTrackFromCompilation', {
        gatheringID: props.albumID,
        entityType: 'compilations',
        entityID: trackID,
        isInList: true
      })
    }

    return {
      dragOptions,
      orderChanged,
      albumTracksOnly,
      removeTrackFromCompilation
    }
  }
})
</script>

<style lang="scss">
@import '~/scss/variables';
@import 'include-media';

.tracklist {
  margin-bottom: 25px;

  @include media('>=laptop') {
    margin-top: 75px;
  }
}
</style>
