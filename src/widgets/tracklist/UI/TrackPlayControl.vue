<template>
  <Button
    v-if="isTrackFetching"
    icon="spinner"
    size="small"
    isText
    className="trackrow__action"
  />
  <Button
    v-else-if="isTrackPlaying"
    icon="playing"
    size="small"
    isText
    className="trackrow__action"
    @mouseenter="isOnHover = true"
  />
  <Button
    v-else-if="isTrackPaused"
    icon="pause"
    size="small"
    isText
    className="trackrow__action"
    @click="playPauseTrack"
    @mouseleave="isOnHover = false"
  />
  <Button
    v-else
    icon="play"
    size="small"
    isText
    className="trackrow__action"
    @click="() => playTrack(track)"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayer } from '~features/player'
import { Button } from '~shared/UI'
import type { TrackBasic } from '~entities/track'

type Props = {
  track: TrackBasic
}

const props = defineProps<Props>()

const isOnHover = ref(false)

const { isTrackFetching, playTrack, playPauseTrack, playingTrack } = usePlayer()

const isTrackPlaying = computed(() => (
  playingTrack.value?._id === props.track._id
  && playingTrack.value.isOnPlaying
  && !playingTrack.value.isOnPause
  && !isOnHover.value
))

const isTrackPaused = computed(() => (
  playingTrack.value?._id === props.track._id
  && playingTrack.value.isOnPause
  || isOnHover.value
))
</script>
