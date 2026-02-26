<template>
  <div class="tracklist">
    <VueDraggableNext
      handle=".--drag"
      v-bind="dragOptions"
      @end="orderChanged"
    >
      <TrackRow
        v-for="(track) in trackList"
        :key="track._id"
        :track="track"
        :trackOptionsMenu="trackOptionsMenu"
        @refetchTracklist="emit('refetchTracklist')"
        @setTrackOptionsMenu="setTrackOptionsMenu"
      />
    </VueDraggableNext>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, type ComputedRef } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { usePlaylistService, type PlaylistTrack } from '~features/player'
import TrackRow from './TrackRow.vue'

import type { DraggableEvent, ReorderPayload } from '~shared/lib'
import type { TrackBasic } from '~entities/track'

type Props = {
  tracks: TrackBasic[]
}

type Emits = {
  (e: 'refetchTracklist'): void
  (e: 'trackOrderChanged', payload: ReorderPayload): void
}

const emit = defineEmits<Emits>()
const props = defineProps<Props>()

const { primaryPlaylist, secondaryPlaylist } = usePlaylistService()

const trackOptionsMenu = ref<string | null>(null)

const setTrackOptionsMenu = (trackId: string | null) => {
  trackOptionsMenu.value = trackId === trackOptionsMenu.value ? null : trackId
}

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

const trackList: ComputedRef<PlaylistTrack[]> = computed(() => {
  const primaryPlaylistMap = new Map<string, PlaylistTrack>(primaryPlaylist.value.map((track) => [track._id, track]))
  const secondaryPlaylistMap = new Map<string, PlaylistTrack>(secondaryPlaylist.value.map((track) => [track._id, track]))

  return props.tracks.map<PlaylistTrack>((track) => {
    const playlistTrack = (primaryPlaylistMap.get(track._id) || secondaryPlaylistMap.get(track._id))!

    return {
      ...(playlistTrack),
      duration: playlistTrack?.duration || track.duration
    }
  })
})

const handleClickOutside = (e: MouseEvent) => {
  e.stopPropagation()
  trackOptionsMenu.value = null
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss">
@use '~/app/styles/variables' as var;

.tracklist {
  @include var.media('>=desktop') {
    margin-top: 5rem;
  }
}
</style>
