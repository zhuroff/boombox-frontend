<template>
  <div class="tracklist">
    <VueDraggableNext
      handle=".--drag"
      v-bind="dragOptions"
      @end="orderChanged"
    >
      <TrackRow
        v-for="(track, index) in trackList"
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
import { usePlaylistService } from '~features/player'
import TrackRow from './TrackRow.vue'

import type { DraggableEvent, ReorderPayload } from '~shared/lib'
import type { TrackBasic } from '~entities/track'

type Props = {
  tracks: TrackBasic[]
  isTOYTracks?: boolean
}

type Emits = {
  (e: 'refetchTracklist'): void
  (e: 'trackOrderChanged', payload: ReorderPayload): void
}

const emit = defineEmits<Emits>()

const props = withDefaults(defineProps<Props>(), {
  isTOYTracks: false
})

const { primaryPlaylist} = usePlaylistService()

const dragOptions = computed(() => ({
  animation: 300
}))

const orderChanged = (event: DraggableEvent) => {
  const payload: ReorderPayload = {
    oldOrder: event.oldIndex,
    newOrder: event.newIndex,
  }

  emit('trackOrderChanged', payload)
}

const trackList = computed(() => {
  const playlistMap = new Map(primaryPlaylist.value.map((track) => [track._id, track]))

  return props.tracks.map((track) => {
    const playlistTrack = playlistMap.get(track._id)
    return {
      ...track,
      duration: playlistTrack?.duration || track.duration
    }
  })
})
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
