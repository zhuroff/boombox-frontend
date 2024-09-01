import usePlayingTrack from '~/store/track'

const actions = (state: PlayerState) => {
  const {
    trackGetters: { playingTrack },
    trackActions: { playTrack }
  } = usePlayingTrack()
  
  const checkOrReplacePlaylists = (track: AlbumTrack) => {
    console.log(
      state.currentPlaylist,
      state.reservedPlaylist,
      track
    )
    // const isFromCurrentPlaylist = !!state.currentPlaylist?.tracks?.some((el) => el._id === track._id)
    // const isFromReserverPlaylist = !!state.reservedPlaylist?.tracks?.some((el) => el._id === track._id)

    // if (!isFromCurrentPlaylist) {
    //   if (isFromReserverPlaylist) {
    //     state.currentPlaylist = { ...state.reservedPlaylist }
    //     state.reservedPlaylist = {} as PlayerPlaylist
    //   } else {
    //     appendTrackToPlaylist({
    //       track,
    //       order: track.order === 1 ? 1 : track.order - 1
    //     })
    //   }
    // }
  }

  const appendTrackToPlaylist = (prop: { track: AlbumTrack, order: number }) => {
    if (!state.currentPlaylist) {
      throw new Error('No current playlist defined')
    }

    state.currentPlaylist.tracks = state.currentPlaylist.tracks
      .reduce<AlbumTrack[]>((acc, next, index) => {
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
    state.currentPlaylist.tracks = state.currentPlaylist.tracks
      .reduce<AlbumTrack[]>((acc, next) => {
        if (next._id === id) order--
        else acc.push({ ...next, order: order })
        order++
        return acc
      }, [])
  }

  const setPlayerPlaylist = (data: any/* AlbumPage | CompilationPage<TrackRes> */) => {
    if (!playingTrack.value?._id) {
      state.currentPlaylist = data
    } else {
      state.reservedPlaylist = data
    }
  }

  const addAlbumToPlaylist = () => {
    if (!state.currentPlaylist) {
      throw new Error('No current playlist defined')
    }

    state.currentPlaylist.tracks = [
      ...state.currentPlaylist.tracks,
      ...(state.reservedPlaylist?.tracks || [])
    ]
  }
  
  const togglePlayerVisibility = () => {
    state.isPlayerExpanded = !state.isPlayerExpanded
  }

  const playTrackNext = (track: AlbumTrack) => {
    if (!playingTrack.value) return

    const index = state.currentPlaylist?.tracks.findIndex((track) => (
      // @ts-expect-error: fix
      track._id === playingTrack.value._id
    ))

    appendTrackToPlaylist({ track, order: index === -1 ? 1 : (index || 0) + 1 })
  }

  const addToEndOfList = (track: AlbumTrack) => {
    const index = state.currentPlaylist?.tracks.length
    appendTrackToPlaylist({ track, order: index || 1 })
  }

  const switchToPrevTrack = () => {
    if (!playingTrack.value) return

    if (!state.currentPlaylist) {
      throw new Error('No current playlist defined')
    }

    const currentTrackIndex = state.currentPlaylist.tracks
      // @ts-expect-error: fix
      .findIndex((track) => track._id === playingTrack.value._id)

    const prevTrack = state.currentPlaylist.tracks[currentTrackIndex - 1]

    if (prevTrack) {
      playTrack(prevTrack)
    }
  }

  const switchToNextTrack = () => {
    if (!state.currentPlaylist) {
      throw new Error('No current playlist defined')
    }

    const currentTrackIndex = state.currentPlaylist.tracks
      // @ts-expect-error: fix
      .findIndex((track) => track._id === state.playingTrack._id)

    const nextTrack = state.currentPlaylist.tracks[currentTrackIndex + 1]

    if (nextTrack) {
      playTrack(nextTrack)
    }
  }

  const changePlaylistOrder = (payload: ReorderPayload) => {
    // @ts-expect-error: fix
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
    if (!playingTrack.value) return
    playingTrack.value.isOnRepeat = !playingTrack.value.isOnRepeat
  }
  
  return {
    setPlayerPlaylist,
    addAlbumToPlaylist,
    removeTrackFromPlaylist,
    togglePlayerVisibility,
    playTrackNext,
    addToEndOfList,
    switchToPrevTrack,
    switchToNextTrack,
    changePlaylistOrder,
    changeRepeatState,
    checkOrReplacePlaylists,
    appendTrackToPlaylist
  }
}

export default actions
