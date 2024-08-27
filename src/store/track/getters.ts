import { computed } from 'vue'

const getters = (state: AudioTrackState) => {
  const playingTrack = computed(() => state.playingTrack)

  return {
    playingTrack
  }
}

export default getters
