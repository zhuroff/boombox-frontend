import { CRACKLE_PATH } from '~shared/constants'

const actions = (state: any) => {
  const setTrackState = (track: any) => {
    state.playingTrack = {
      _id: track._id,
      title: track.title,
      source: track.path,
      cloudURL: track.cloudURL,
      duration: track.duration || 0,
      artistName: track.artist.title || '',
      albumName: track.inAlbum.title || '',
      albumID: track.inAlbum._id,
      year: track.period.title,
      cover: track.albumCover,
      isOnLoading: false,
      isOnPause: false,
      isOnRepeat: false,
      isDisabled: false,
      progressLine: 0,
      progressTime: 0,
      audio: new Audio(track.path || ''),
      crackle: new Audio(CRACKLE_PATH)
    }

    if (track.inAlbum.folderName) {
      state.playingTrack.albumFolder = track.inAlbum.folderName
    }

    state.playingTrack.crackle.loop = true
    state.playingTrack.audio.volume = Number(localStorage.getItem('playerVolume')) || 1
    state.playingTrack.crackle.volume = Number(localStorage.getItem('playerVolume')) || 1
  }

  const appendTrackToPlaylist = (prop: { track: any, order: number }) => {
    if (!state.currentPlaylist) {
      throw new Error('No current playlist defined')
    }

    // @ts-expect-error: fix
    state.currentPlaylist.tracks = state.currentPlaylist.tracks
      .reduce<any[]>((acc, next, index) => {
        if (index + 1 === prop.order) {
          acc.push({ ...next, order: prop.order })
          acc.push({ ...prop.track, order: prop.order + 1 })
        } else {
          acc.push({ ...next, order: (acc.at(-1)?.order || 0) + 1 })
        }
        return acc
      }, [])
  }

  const removeTrackFromPlaylist = (id: string) => {
    if (!state.currentPlaylist) {
      throw new Error('No current playlist defined')
    }

    let order = 1
    // @ts-expect-error: fix
    state.currentPlaylist.tracks = state.currentPlaylist.tracks
      .reduce<any[]>((acc, next) => {
        if (next._id === id) order--
        else acc.push({ ...next, order: order })
        order++
        return acc
      }, [])
  }
  
  const togglePlayerVisibility = () => {
    state.isPlayerExpanded = !state.isPlayerExpanded
  }

  const addToEndOfList = (track: any) => {
    const index = state.currentPlaylist?.tracks.length
    appendTrackToPlaylist({ track, order: index || 1 })
  }

  const changePlaylistOrder = (payload: any) => {
    const targetPlaylistTracks = state.currentPlaylist?._id === payload.entityID
      ? state.currentPlaylist.tracks
      : state.reservedPlaylist?.tracks

    if (!targetPlaylistTracks) {
      throw new Error('No target playlist defined')
    }

    targetPlaylistTracks.splice(
      payload.newOrder, 0,
      targetPlaylistTracks.splice(payload.oldOrder, 1)[0]
    )

    for (let i = 0; i < targetPlaylistTracks.length; i++) {
      targetPlaylistTracks[i].order = i + 1
    }
  }

  const changeRepeatState = () => {
    if (!state.playingTrack) return
    state.playingTrack.isOnRepeat = !state.playingTrack.isOnRepeat
  }
}
