import { CRACKLE_PATH } from '~shared/constants'
import cloudServices from "~/~legacy/services/cloud.services"
import { DatabaseService } from "~/shared/api"
import type { ReorderPayload } from '~/shared/lib'

const databaseService = new DatabaseService()

const actions = (state: PlayerState) => {
  const setTrackState = (track: AlbumTrack) => {
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
  
  // const resetState = () => {
  //   state.playingTrack = null
  // }

  // const setTrackLoadingState = (id: string) => {
  //   if (!state.playingTrack) return

  //   state.playingTrack._id === id
  //   state.playingTrack.isOnLoading = true
  //   state.playingTrack.audio.src = ''
  // }

  const playAudio = (track: AlbumTrack, cb: (track: AlbumTrack) => Promise<void>, isFromDB = true) => {
    if (!state.playingTrack) return

    const { audio, _id } = state.playingTrack
    audio.play()
      .then(() => {
        if (state.playingTrack) {
          state.playingTrack.isOnLoading = false
        }
        if (isFromDB) {
          checkAndSetDuration(track, cb)
        } else {
          setTrackDuration({ trackID: _id, duration: audio.duration })
          timeProgressHandler(track, cb)
        }
      })
      .catch(console.error)
  }

  // const checkAndSetDuration = (track: AlbumTrack, cb: (track: AlbumTrack) => Promise<void>) => {
  //   if (!state.playingTrack) return

  //   const { audio, _id } = state.playingTrack

  //   if (state.playingTrack.duration) {
  //     setTrackDuration({ trackID: _id, duration: state.playingTrack.duration })
  //     timeProgressHandler(track, cb)
  //   } else if (!audio.duration || audio.duration === Infinity) {
  //     getTrackDuration({ track, audio }, cb)
  //   } else {
  //     setTrackDuration({ trackID: _id, duration: audio.duration })
  //     timeProgressHandler(track, cb)
  //     saveTrackDuration(audio.duration, _id)
  //   }
  // }

  // const setTrackDuration = (payload: { trackID: string; duration: number }) => {
  //   if (!state.playingTrack) return

  //   const { trackID, duration } = payload
  //   const targetTrack = state.currentPlaylist?.tracks.find((track) => (
  //     track._id === trackID
  //   ))

  //   if (targetTrack) {
  //     targetTrack.duration = duration
  //   }

  //   state.playingTrack.duration = duration
  // }

  // const timeProgressHandler = (track: AlbumTrack, cb: (track: AlbumTrack) => Promise<void>) => {
  //   if (!state.playingTrack) return

  //   const { isOnRepeat, audio, _id } = state.playingTrack
  //   let isCounterIncremented = Boolean(track.isTOY)
  //   audio.ontimeupdate = () => {
  //     if (!state.playingTrack) {
  //       throw new Error('No playing track defined')
  //     }

  //     if (!state.currentPlaylist) {
  //       throw new Error('No current playlist defined')
  //     }

  //     const progressLine = audio.currentTime / state.playingTrack.duration
  //     const progressTime = audio.currentTime

  //     updateListeningProgress({ progressLine, progressTime })

  //     if (progressLine >= 1) {
  //       if (isOnRepeat) {
  //         playAudio(track, cb)
  //       } else {
  //         const activePlaylist = state.currentPlaylist.tracks
  //           // @ts-expect-error: fix
  //           .filter((t) => !t.isDisabled)

  //         const currentTrackIndex = activePlaylist
  //           .findIndex((t) => t._id === _id)

  //         const nextTrack = activePlaylist[currentTrackIndex + 1]

  //         if (nextTrack) {
  //           cb(nextTrack)
  //         } else {
  //           state.playingTrack = null
  //         }
  //       }
  //     }
  //   }
  // }

  // const getTrackDuration = async (
  //   { audio, track }: { audio: HTMLAudioElement, track: AlbumTrack },
  //   cb: (track: AlbumTrack) => Promise<void>
  // ) => {
  //   if (audio.duration !== Infinity) {
  //     saveTrackDuration(audio.duration, track._id)
  //     timeProgressHandler(track, cb)
  //   } else {
  //     const audioLink = await cloudServices.getTrackDuration({ path: track.path, cloudURL: track.cloudURL })
  //     const pureAudio = new Audio(audioLink)
  //     pureAudio.onloadedmetadata = () => {
  //       setTrackDuration({ trackID: track._id, duration: pureAudio.duration })
  //       timeProgressHandler(track, cb)
  //       saveTrackDuration(pureAudio.duration, track._id)
  //     }
  //   }
  // }

  // const saveTrackDuration = async (duration: number, trackID: string) => {
  //   if (duration === Infinity) return

  //   try {
  //     await databaseService.updateEntity(`tracks/${trackID}/duration`, { duration })
  //     setTrackDuration({ trackID, duration })
  //   } catch (error) {
  //     throw error
  //   }
  // }

  // const updateListeningProgress = (payload: TrackProgress) => {
  //   if (!state.playingTrack) return

  //   const { progressLine, progressTime } = payload

  //   state.playingTrack.progressLine = progressLine
  //   state.playingTrack.progressTime = progressTime
  // }

  // const updateListeningCounter = (id: string) => {
  //   const targetTrack = state.currentPlaylist?.tracks.find((track) => (
  //     track._id === id
  //   ))

  //   if (targetTrack) {
  //     targetTrack.listened += 1
  //   }
  // }

  const playTrack = async (track: AlbumTrack) => {
    setTrackLoadingState(track._id)
    checkOrReplacePlaylists(track)
    
    try {
      const trackSourceLink: string = await cloudServices.getFile({
        entityType: 'tracks/audio',
        path: track.path,
        cloudURL: track.cloudURL,
        // @ts-expect-error: temp
        cloudId: track.cloudId,
        type:'audio',
        root: track.isTOY ? 'TOY' : ''
      })

      if (!trackSourceLink) {
        throw new Error('Unable to get track source link')
      }
      
      setTrackState({
        ...track,
        path: trackSourceLink
      })
      playAudio(track, playTrack, !track.isTOY)
    } catch (error) {
      console.error(error)
    }
  }

  const setTrackOnPause = () => {
    if (!state.playingTrack) return

    state.playingTrack.isOnPause = true
    state.playingTrack.audio.pause()
  }

  const continuePlay = () => {
    if (!state.playingTrack) return
    
    state.playingTrack.isOnPause = false
    state.playingTrack.audio.play()
  }

  const setPosition = (value: number) => {
    if (!state.playingTrack) return
    
    try {
      state.playingTrack.audio.currentTime = value * state.playingTrack.duration
    } catch (ignore) {
      ignore
    }
  }

  const setSoundVolume = (value: number) => {
    if (!state.playingTrack) return

    state.playingTrack.audio.volume = value
    state.playingTrack.crackle.volume = value
    localStorage.setItem('playerVolume', String(value))
  }

  const switchMuteState = () => {
    if (!state.playingTrack) return

    state.playingTrack.audio.muted = !state.playingTrack.audio.muted
    state.playingTrack.crackle.muted = !state.playingTrack.crackle.muted
  }

  const disableOrEnableTrack = (id: string) => {
    console.log(id)
    // const targetTrack = state.currentPlaylist?.tracks.find((el) => el._id === id)
    //   || state.reservedPlaylist?.tracks.find((el) => el._id === id)

    // if (targetTrack) {
    //   targetTrack.isDisabled = !targetTrack.isDisabled
    // }
  }

  const crackleSwitch = () => {
    if (!state.playingTrack) return

    if (state.playingTrack.crackle?.paused) {
      state.playingTrack.crackle.play()
    } else {
      state.playingTrack.crackle && state.playingTrack.crackle.pause()
    }
  }
  
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
    if (!state.playingTrack?._id) {
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
    if (!state.playingTrack) return

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
    if (!state.playingTrack) return

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
    if (!state.playingTrack) return
    state.playingTrack.isOnRepeat = !state.playingTrack.isOnRepeat
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
    appendTrackToPlaylist,
    setTrackState,
    resetState,
    playAudio,
    playTrack,
    setTrackOnPause,
    continuePlay,
    setPosition,
    setSoundVolume,
    switchMuteState,
    crackleSwitch,
    disableOrEnableTrack,
    setTrackLoadingState
  }
}

export default actions
