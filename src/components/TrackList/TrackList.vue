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

<script setup lang="ts">
import { reactive, computed } from 'vue'
import type { DraggableEvent } from '~/types/Common'
import { VueDraggableNext } from 'vue-draggable-next'
import usePlaylist from '~/store/playlist'
import AlbumTrack from '~/classes/AlbumTrack'
import TrackListRow from './TrackListRow.vue'

interface Props {
  tracks: AlbumTrack[]
  albumID: string
  isCompilation?: boolean
  isTOY?: boolean
}

interface Emits {
  (e: 'trackOrderChanged', payload: ReorderPayload): void
  (e: 'removeTrackFromCompilation', payload: GatheringUpdateReq): void
}

const props = withDefaults(defineProps<Props>(), {
  isCompilation: false,
  isTOY: false
})

const emit = defineEmits<Emits>()

const {
  playerActions: { changePlaylistOrder }
} = usePlaylist()

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

  changePlaylistOrder(payload)

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
