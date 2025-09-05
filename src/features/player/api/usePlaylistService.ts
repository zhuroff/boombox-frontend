import { ref } from 'vue'
import { hostString, coverPlaceholders } from '~shared/utils'
import type { UnifiedEntityFullCard } from '~widgets/entity-cards'
import type { TrackBasic } from '~entities/track'
import type { PlaylistTrack } from '~features/player'

const primaryPlaylist = ref<PlaylistTrack[]>([])
const secondaryPlaylist = ref<PlaylistTrack[]>([])
const isPlaylistActive = ref(false)

const usePlaylistService = () => {
  const initPlaylist = (album: UnifiedEntityFullCard) => {
    if (album.kind === 'embedded') return

    const albumCover = album.kind === 'album'
      ? album.coverURL
        ? album.coverURL
        : coverPlaceholders('album')
      : album.avatar
        ? hostString(album.avatar)
        : coverPlaceholders('album')

    const playerTracks = album.tracks.map<PlaylistTrack>((track, index) => ({
      ...track,
      order: ++index,
      albumId: album._id,
      albumKind: album.title.startsWith('TOY') ? 'toy' : album.kind,
      albumCover
    }))

    if (!primaryPlaylist.value.length || !isPlaylistActive.value) {
      primaryPlaylist.value = playerTracks
    } else {
      secondaryPlaylist.value = playerTracks
    }
  }

  const searchTrackInPlaylists = (track: TrackBasic): PlaylistTrack | undefined => {
    let targetTrack = primaryPlaylist.value.find(({ _id }) => _id === track._id)

    if (!targetTrack) {
      targetTrack = secondaryPlaylist.value.find(({ _id }) => _id === track._id)

      if (targetTrack) {
        primaryPlaylist.value = secondaryPlaylist.value
        secondaryPlaylist.value = []
      }
      
      console.error('Track not found in playlists')
      return
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
