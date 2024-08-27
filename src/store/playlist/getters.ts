import { computed } from 'vue'
import usePlayingTrack from '~/store/track'

const getters = (state: PlayerState) => {
  const { trackGetters: { playingTrack } } = usePlayingTrack()

  const currentPlaylist = computed(() => state.currentPlaylist)

  const reservedPlaylist = computed(() => state.reservedPlaylist)

  const currentPlaylistTracks = computed(() => (
    state.currentPlaylist?.tracks || []
  ))

  const isPlayerExpanded = computed(() => state.isPlayerExpanded)

  const isNextTrackExists = computed(() => {
    const playingTrackIndex = currentPlaylistTracks.value
      .findIndex((track) => track._id === playingTrack.value?._id)

    return playingTrackIndex < currentPlaylistTracks.value.length - 1
  })

  const isPrevTrackExists = computed(() => {
    const playingTrackIndex = currentPlaylistTracks.value
      .findIndex((track) => track._id === playingTrack.value?._id)

    return playingTrackIndex > 0
  })

  const showState = computed(() => state)

  return {
    currentPlaylist,
    reservedPlaylist,
    isNextTrackExists,
    isPrevTrackExists,
    currentPlaylistTracks,
    isPlayerExpanded,
    showState
  }
}

export default getters
