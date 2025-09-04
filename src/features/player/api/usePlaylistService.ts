import { ref } from 'vue'
import type { TrackBasic } from '~entities/track'
import type { PlaylistTrack } from '~features/player'

const primaryPlaylist = ref<PlaylistTrack[]>([])
const secondaryPlaylist = ref<PlaylistTrack[]>([])
const isPlaylistActive = ref(false)

const usePlaylistService = () => {
  const initPlaylist = (tracks: TrackBasic[] | undefined) => {
    if (!tracks?.length) return

    const playerTracks = tracks.map<PlaylistTrack>((track, index) => ({
      ...track,
      order: ++index
    }))

    if (!primaryPlaylist.value.length || !isPlaylistActive.value) {
      primaryPlaylist.value = playerTracks
    } else {
      secondaryPlaylist.value = playerTracks
    }
  }

  const searchTrackInPlaylists = (track: TrackBasic): PlaylistTrack => {
    let targetTrack = primaryPlaylist.value.find(({ _id }) => _id === track._id)

    if (!targetTrack) {
      targetTrack = secondaryPlaylist.value.find(({ _id }) => _id === track._id)

      if (targetTrack) {
        primaryPlaylist.value = secondaryPlaylist.value
        secondaryPlaylist.value = []
      } else {
        targetTrack = {
          ...track,
          order: 1
        }

        primaryPlaylist.value = [targetTrack]
      }
    }

    return targetTrack
  }

  const getNextTrack = (playingTrackId: string | undefined) => {
    const currentTrackIndex = primaryPlaylist.value.findIndex(({ _id }) => _id === playingTrackId)

    if (currentTrackIndex === -1) return
    return primaryPlaylist.value[currentTrackIndex + 1]
  }

  const setTrackDuration = (trackId: string, duration: number) => {
    const targetTrack = primaryPlaylist.value.find(({ _id }) => _id === trackId)

    if (targetTrack) {
      targetTrack.duration = duration
    }
  }

  return {
    initPlaylist,
    getNextTrack,
    primaryPlaylist,
    isPlaylistActive,
    setTrackDuration,
    searchTrackInPlaylists
  }
}

export default usePlaylistService
