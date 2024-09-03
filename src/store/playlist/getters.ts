import { computed } from 'vue'

const getters = (state: PlayerState) => {
  const currentPlaylist = computed(() => state.currentPlaylist)

  const reservedPlaylist = computed(() => state.reservedPlaylist)

  const playingTrack = computed(() => state.playingTrack)

  const currentPlaylistTracks = computed(() => (
    state.currentPlaylist?.tracks || []
  ))

  const isPlayerExpanded = computed(() => state.isPlayerExpanded)

  const isNextTrackExists = computed(() => {
    const playingTrackIndex = currentPlaylistTracks.value
      .findIndex((track) => track._id === state.playingTrack?._id)

    return playingTrackIndex < currentPlaylistTracks.value.length - 1
  })

  const isPrevTrackExists = computed(() => {
    const playingTrackIndex = currentPlaylistTracks.value
      .findIndex((track) => track._id === state.playingTrack?._id)

    return playingTrackIndex > 0
  })

  const showState = computed(() => state)

  return {
    currentPlaylist,
    reservedPlaylist,
    playingTrack,
    isNextTrackExists,
    isPrevTrackExists,
    currentPlaylistTracks,
    isPlayerExpanded,
    showState
  }
}

export default getters
