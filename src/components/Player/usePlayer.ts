import { ComputedRef, computed } from 'vue'
import { useStore } from 'vuex'
import { key } from '~/store'
import { Track } from '~/types/Track'
import { PlayingTrack } from '~/types/Player'

const usePlayer = () => {
  const store = useStore(key)

  const currentPlaylistTracks: ComputedRef<Track[]> = computed(() => (
    store.getters.currentPlaylistTracks
  ))

  const playingTrack: ComputedRef<PlayingTrack> = computed(() => (
    store.getters.playingTrack
  ))

  const activePlaylistTracks = computed(() => (
    currentPlaylistTracks.value
      .filter((track) => !track.isDisabled)
  ))

  return {
    currentPlaylistTracks,
    activePlaylistTracks,
    playingTrack,
    store
  }
}

export default usePlayer
