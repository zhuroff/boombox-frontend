import { CRACKLE_PATH } from '~/global'
import usePlaylist from '~/store/playlist'
import databaseServices from '~/services/database.services'
import cloudServices from '~/services/cloud.services'

const {
  playerGetters: { currentPlaylist },
  playerActions: { checkOrReplacePlaylists }
} = usePlaylist()

const actions = (state: AudioTrackState) => {
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
  
  const resetState = () => {
    state.playingTrack = null
  }

  const setTrackLoadingState = (id: string) => {
    if (!state.playingTrack) return

    state.playingTrack._id === id
    state.playingTrack.isOnLoading = true
    state.playingTrack.audio.src = ''
  }

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

  const checkAndSetDuration = (track: AlbumTrack, cb: (track: AlbumTrack) => Promise<void>) => {
    if (!state.playingTrack) return

    const { audio, _id } = state.playingTrack

    if (state.playingTrack.duration) {
      setTrackDuration({ trackID: _id, duration: state.playingTrack.duration })
      timeProgressHandler(track, cb)
    } else if (!audio.duration || audio.duration === Infinity) {
      getTrackDuration({ track, audio }, cb)
    } else {
      setTrackDuration({ trackID: _id, duration: audio.duration })
      timeProgressHandler(track, cb)
      saveTrackDuration(audio.duration, _id)
    }
  }

  const setTrackDuration = (payload: { trackID: string; duration: number }) => {
    if (!state.playingTrack) return

    const { trackID, duration } = payload
    const targetTrack = currentPlaylist.value?.tracks.find((track) => (
      track._id === trackID
    ))

    if (targetTrack) {
      targetTrack.duration = duration
    }

    state.playingTrack.duration = duration
  }

  const timeProgressHandler = (track: AlbumTrack, cb: (track: AlbumTrack) => Promise<void>) => {
    if (!state.playingTrack) return

    const { isOnRepeat, audio, _id } = state.playingTrack
    let isCounterIncremented = Boolean(track.isTOY)
    audio.ontimeupdate = () => {
      if (!state.playingTrack) {
        throw new Error('No playing track defined')
      }

      if (!currentPlaylist.value) {
        throw new Error('No current playlist defined')
      }

      const progressLine = audio.currentTime / state.playingTrack.duration
      const progressTime = audio.currentTime

      updateListeningProgress({ progressLine, progressTime })

      if (!isCounterIncremented && progressLine > 0.75) {
        incrementListeningCounter(_id)
        isCounterIncremented = true
      }

      if (progressLine >= 1) {
        if (isOnRepeat) {
          playAudio(track, cb)
        } else {
          const activePlaylist = currentPlaylist.value.tracks
            // @ts-expect-error: fix
            .filter((t) => !t.isDisabled)

          const currentTrackIndex = activePlaylist
            .findIndex((t) => t._id === _id)

          const nextTrack = activePlaylist[currentTrackIndex + 1]

          if (nextTrack) {
            cb(nextTrack)
          } else {
            state.playingTrack = null
          }
        }
      }
    }
  }

  const getTrackDuration = async (
    { audio, track }: { audio: HTMLAudioElement, track: AlbumTrack },
    cb: (track: AlbumTrack) => Promise<void>
  ) => {
    if (audio.duration !== Infinity) {
      saveTrackDuration(audio.duration, track._id)
      timeProgressHandler(track, cb)
    } else {
      const audioLink = await cloudServices.getTrackDuration({ path: track.path, cloudURL: track.cloudURL })
      const pureAudio = new Audio(audioLink)
      pureAudio.onloadedmetadata = () => {
        setTrackDuration({ trackID: track._id, duration: pureAudio.duration })
        timeProgressHandler(track, cb)
        saveTrackDuration(pureAudio.duration, track._id)
      }
    }
  }

  const saveTrackDuration = async (duration: number, trackID: string) => {
    if (duration === Infinity) return

    try {
      await databaseServices.updateEntity(`tracks/${trackID}/duration`, { duration })
      setTrackDuration({ trackID, duration })
    } catch (error) {
      throw error
    }
  }

  const updateListeningProgress = (payload: TrackProgress) => {
    if (!state.playingTrack) return

    const { progressLine, progressTime } = payload

    state.playingTrack.progressLine = progressLine
    state.playingTrack.progressTime = progressTime
  }

  const incrementListeningCounter = async (trackID: string) => {
    try {
      await databaseServices.updateEntity(`tracks/${trackID}/listened`)
      updateListeningCounter(trackID)
    } catch (error) {
      console.error(error)
    }
  }

  const updateListeningCounter = (id: string) => {
    const targetTrack = currentPlaylist.value?.tracks.find((track) => (
      track._id === id
    ))

    if (targetTrack) {
      targetTrack.listened += 1
    }
  }

  const playTrack = async (track: AlbumTrack) => {
    setTrackLoadingState(track._id)
    checkOrReplacePlaylists(track)
    
    try {
      const trackSourceLink: string = await cloudServices.getFile({
        entityType: 'tracks/audio',
        path: track.path,
        cloudURL: track.cloudURL,
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

  return {
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
