<template>
  <div class="player__progress">
    <time class="player__progress-time">{{ leftTimeToMinutes }}</time>

    <progress
      :max="1"
      :value="playingTrack.progressLine || 0"
      class="player__progress-bar"
      @click="setTrackPosition"
    ></progress>

    <time class="player__progress-time">{{ fullTimeToMinutes }}</time>
  </div>
</template>

<script lang="ts">

import { defineComponent, computed } from 'vue'
import { usePlayer } from '~/hooks/usePlayer'

export default defineComponent({
  setup() {
    const {
      playingTrack,
      store
    } = usePlayer()

    const leftTimeToMinutes = computed(() => {
      const minutes = Math.floor(playingTrack.value.progressTime / 60)
      const seconds = Math.floor(playingTrack.value.progressTime - minutes * 60)

      if (Number.isNaN(minutes)) return '0:00'

      return `${minutes}:${seconds >= 10 ? seconds : `0${seconds}`}`
    })

    const fullTimeToMinutes = computed(() => {
      const minutes = Math.floor(Number(playingTrack.value.duration) / 60)
      const seconds = Math.floor(Number(playingTrack.value.duration) - minutes * 60)

      if (Number.isNaN(minutes)) return '0:00'

      return `${minutes}:${seconds >= 10 ? seconds : `0${seconds}`}`
    })

    const setTrackPosition = (event: PointerEvent) => {
      const value = event.offsetX / (event.target as HTMLElement).offsetWidth
      store.commit('setPosition', value)
    }

    return {
      leftTimeToMinutes,
      fullTimeToMinutes,
      setTrackPosition,
      playingTrack
    }
  },
})

</script>

../../hooks/usePlayer