import { ComputedRef, computed } from 'vue'
import { useStore } from 'vuex'
import { key } from '~/store'
import { IAlbumTrack } from '~/types/Album'
import { IPlayingTrack } from '~/types/Player'

const usePlayer = () => {
  const store = useStore(key)

  const currentPlaylistTracks: ComputedRef<IAlbumTrack[]> = computed(() => (
    store.getters.currentPlaylistTracks
  ))

  const playingTrack: ComputedRef<IPlayingTrack> = computed(() => (
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
