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

<script lang="ts">
import { defineComponent, computed } from 'vue'
import store from '~/store'

export default defineComponent({
  setup() {
    const { actions, getters } = store

    const leftTimeToMinutes = computed(() => {
      if (!getters.playingTrack.value) return '0:00'

      const minutes = Math.floor(getters.playingTrack.value.progressTime / 60)
      const seconds = Math.floor(getters.playingTrack.value.progressTime - minutes * 60)

      if (Number.isNaN(minutes)) return '0:00'

      return `${minutes}:${seconds >= 10 ? seconds : `0${seconds}`}`
    })

    const fullTimeToMinutes = computed(() => {
      if (!getters.playingTrack.value) return '0:00'

      const minutes = Math.floor(Number(getters.playingTrack.value.duration) / 60)
      const seconds = Math.floor(Number(getters.playingTrack.value.duration) - minutes * 60)

      if (Number.isNaN(minutes)) return '0:00'

      return `${minutes}:${seconds >= 10 ? seconds : `0${seconds}`}`
    })

    const setTrackPosition = (event: MouseEvent) => {
      const value = event.offsetX / (event.target as HTMLElement).offsetWidth
      actions.setPosition(value)
    }

    return {
      leftTimeToMinutes,
      fullTimeToMinutes,
      setTrackPosition,
      playingTrack: getters.playingTrack.value
    }
  },
})
</script>
