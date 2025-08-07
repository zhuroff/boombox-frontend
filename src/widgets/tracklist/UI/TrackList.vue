<template>
  <div class="tracklist">
    <VueDraggableNext
      handle=".--drag"
      v-bind="dragOptions"
      @end="orderChanged"
    >
      <TrackRow
        v-for="(track, index) in tracks"
        :key="track._id"
        :track="track"
        :order="index + 1"
        :isTOYTrack="isTOYTracks"
        @refetchTracklist="emit('refetchTracklist')"
      />
    </VueDraggableNext>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import type { DraggableEvent, ReorderPayload } from '~shared/lib'
import type { TrackBasic } from '~entities/track'
import TrackRow from './TrackRow.vue'

type Props = {
  tracks: TrackBasic[]
  isDraggable?: boolean
  isTOYTracks?: boolean
}

type Emits = {
  (e: 'refetchTracklist'): void
}

const emit = defineEmits<Emits>()

const props = withDefaults(defineProps<Props>(), {
  isDraggable: true,
  isTOYTracks: false
})

const dragOptions = computed(() => ({
  disabled: !props.isDraggable,
  animation: 300,
}))

const orderChanged = (event: DraggableEvent) => {
  console.log(event)
  // const payload: ReorderPayload = {
  //   oldOrder: event.oldIndex,
  //   newOrder: event.newIndex,
  //   entityID: props.albumID
  // }

  // changePlaylistOrder(payload)

  // if (props.isCompilation) {
  //   emit('trackOrderChanged', payload)
  // }
}
</script>

<style lang="scss">
@use '~/app/styles/variables' as var;

.tracklist {
  margin-bottom: 25px;

  @include var.media('>=laptop') {
    margin-top: 75px;
  }
}
</style>
