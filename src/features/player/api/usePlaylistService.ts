import { ref } from 'vue'
import { hostString, coverPlaceholders } from '~shared/utils'
import type { UnifiedEntityFullCard } from '~widgets/entity-cards'
import type { TrackBasic } from '~entities/track'
import type { PlaylistTrack } from '~features/player'

const primaryPlaylist = ref<PlaylistTrack[]>([])
const secondaryPlaylist = ref<PlaylistTrack[]>([])
const isPlayingStarted = ref(false)

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

    if (!primaryPlaylist.value.length || !isPlayingStarted.value) {
      primaryPlaylist.value = playerTracks
    } else {
      secondaryPlaylist.value = playerTracks
    }
  }

  const replacePlaylist = () => {
    primaryPlaylist.value = secondaryPlaylist.value
    secondaryPlaylist.value = []
  }

  const searchTrackInPlaylists = (track: TrackBasic, callback?: () => void): PlaylistTrack | undefined => {
    let targetTrack = primaryPlaylist.value.find(({ _id }) => _id === track._id)

    if (!targetTrack) {
      targetTrack = secondaryPlaylist.value.find(({ _id }) => _id === track._id)

      if (!targetTrack) {
        console.error('Track not found in playlists')
        return
      }
      
      callback?.()
    }

    return targetTrack
  }

  const getNextTrack = (playingTrackId: string | undefined): PlaylistTrack | undefined => {
    if (!playingTrackId) return
    
    let playlist = primaryPlaylist
    let currentTrackIndex = playlist.value.findIndex(({ _id }) => _id === playingTrackId)

    if (currentTrackIndex === -1) {
      playlist = secondaryPlaylist
      currentTrackIndex = playlist.value.findIndex(({ _id }) => _id === playingTrackId)
    }

    if (currentTrackIndex === playlist.value.length - 1) return

    const targetTrack = playlist.value[currentTrackIndex + 1]

    if (!targetTrack) return

    return (
      targetTrack.idDisabled
        ? getNextTrack(targetTrack._id)
        : targetTrack
    )
  }

  const getPrevTrack = (playingTrackId: string | undefined): PlaylistTrack | undefined => {
    if (!playingTrackId) return

    let playlist = primaryPlaylist
    let currentTrackIndex = playlist.value.findIndex(({ _id }) => _id === playingTrackId)

    if (currentTrackIndex === -1) {
      playlist = secondaryPlaylist
      currentTrackIndex = playlist.value.findIndex(({ _id }) => _id === playingTrackId)
    }

    if (currentTrackIndex === 0) return

    const targetTrack = playlist.value[currentTrackIndex - 1]

    if (!targetTrack) return

    return (
      targetTrack.idDisabled
        ? getPrevTrack(targetTrack._id)
        : targetTrack
    )
  }

  const isTrackInPlaylist = (trackId: string) => {
    return primaryPlaylist.value.some(({ _id }) => _id === trackId)
  }

  const addTrackToPlaylist = (track: TrackBasic, currentIndex?: number) => {
    const targetTrack = searchTrackInPlaylists(track)

    if (typeof currentIndex !== 'number') {      
      targetTrack && primaryPlaylist.value.push(targetTrack)
    } else {
      targetTrack && primaryPlaylist.value.splice(currentIndex + 1, 0, targetTrack)
    }
  }

  const setTrackDuration = (trackId: string, duration: number) => {
    const targetTrack = primaryPlaylist.value.find(({ _id }) => _id === trackId)

    if (targetTrack) {
      targetTrack.duration = duration
    }
  }

  const toggleTrackAvailability = (track: TrackBasic) => {
    const targetTrack = searchTrackInPlaylists(track)

    if (!targetTrack) return
    targetTrack.idDisabled = !targetTrack.idDisabled
  }

  return {
    initPlaylist,
    getNextTrack,
    getPrevTrack,
    toggleTrackAvailability,
    replacePlaylist,
    primaryPlaylist,
    isPlayingStarted,
    setTrackDuration,
    secondaryPlaylist,
    isTrackInPlaylist,
    addTrackToPlaylist,
    searchTrackInPlaylists
  }
}

export default usePlaylistService
