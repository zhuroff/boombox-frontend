import { ComputedRef, computed } from 'vue'
import { useStore } from 'vuex'
import { key } from '~/store'
import { Track } from '~/types/Track'
import { PlayingTrack } from '~/types/Player'

const usePlayer = () => {
  const store = useStore(key)

  const isPlayerExpanded: ComputedRef<boolean> = computed(() => (
    store.getters.isPlayerExpanded
  ))

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

  const collapseExpandPlayer = () => {
    store.commit('expandPlayer')
  }

  const isNextTrackExist = computed(() => {     
    const playingTrackIndex = activePlaylistTracks.value
      .findIndex((track) => track.fileid === playingTrack.value.fileid)

    return playingTrackIndex < activePlaylistTracks.value.length - 1
  })

  const switchToNextTrack = () => {
    const currentTrackIndex = activePlaylistTracks.value
      .findIndex((track) => track.fileid === playingTrack.value.fileid)

    const nextTrack = activePlaylistTracks.value[currentTrackIndex + 1]

    if (nextTrack) {
      store.dispatch('playTrack', nextTrack.fileid)
    }
  }

  const isPrevTrackExist = computed(() => {
    const playingTrackIndex = activePlaylistTracks.value
      .findIndex((track) => track.fileid === playingTrack.value.fileid)
    
    return playingTrackIndex > 0
  })

  const switchToPrevTrack = () => {
    const currentTrackIndex = activePlaylistTracks.value
      .findIndex((track) => track.fileid === playingTrack.value.fileid)

    const prevTrack = activePlaylistTracks.value[currentTrackIndex - 1]

    if (prevTrack) {
      store.dispatch('playTrack', prevTrack.fileid)
    }
  }

  return {
    isPlayerExpanded,
    currentPlaylistTracks,
    activePlaylistTracks,
    playingTrack,
    collapseExpandPlayer,
    isNextTrackExist,
    switchToNextTrack,
    isPrevTrackExist,
    switchToPrevTrack,
    store
  }
}

export default usePlayer
