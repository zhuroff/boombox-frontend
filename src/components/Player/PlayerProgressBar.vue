<template>
  <div class="player__progress">
    <time class="player__progress-time">{{ leftTimeToMinutes }}</time>
    <progress
      :max="1"
      :value="playingTrack?.progressLine || 0"
      class="player__progress-bar"
      @click="setTrackPosition"
    ></progress>
    <time class="player__progress-time">{{ fullTimeToMinutes }}</time>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import usePlayingTrack from '~/store/track'

const {
  trackGetters: { playingTrack },
  trackActions: { setPosition }
} = usePlayingTrack()

const leftTimeToMinutes = computed(() => {
  if (!playingTrack.value) return '0:00'

  const minutes = Math.floor(playingTrack.value.progressTime / 60)
  const seconds = Math.floor(playingTrack.value.progressTime - minutes * 60)

  if (Number.isNaN(minutes)) return '0:00'

  return `${minutes}:${seconds >= 10 ? seconds : `0${seconds}`}`
})

const fullTimeToMinutes = computed(() => {
  if (!playingTrack.value) return '0:00'

  const minutes = Math.floor(Number(playingTrack.value.duration) / 60)
  const seconds = Math.floor(Number(playingTrack.value.duration) - minutes * 60)

  if (Number.isNaN(minutes)) return '0:00'

  return `${minutes}:${seconds >= 10 ? seconds : `0${seconds}`}`
})

const setTrackPosition = (event: MouseEvent) => {
  const value = event.offsetX / (event.target as HTMLElement).offsetWidth
  setPosition(value)
}
</script>
