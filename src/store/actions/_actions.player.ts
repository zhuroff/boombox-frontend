import { AppStateInterface, PlayerPlaylist } from '~/types/Common'
import { TrackProgress } from '~/types/Player'
import AlbumTrack from '~/classes/AlbumTrack'
import cloudServices from '~/services/cloud.services'
import databaseServices from '~/services/database.services'
import PlayerTrack from '~/classes/PlayerTrack'

export const useActionsPlayerPrivate = (state: AppStateInterface) => {
  const setLoadingState = (id: string) => {
    state.playingTrack._id === id
    state.playingTrack.isOnLoading = true

    if (state.playingTrack.audio) {
      state.playingTrack.audio.src = ''
    }
  }

  const checkOrReplacePlaylists = (track: AlbumTrack) => {
    const isFromCurrentPlaylist = state.currentPlaylist.tracks?.some((el) => el._id === track._id)
    const isFromReserverPlaylist = state.reservedPlaylist.tracks?.some((el) => el._id === track._id)

    if (!isFromCurrentPlaylist) {
      if (isFromReserverPlaylist) {
        state.currentPlaylist = { ...state.reservedPlaylist }
        state.reservedPlaylist = {} as PlayerPlaylist
      } else {
        appendTrackToPlaylist({
          track,
          order: track.order === 1 ? 1 : track.order - 1
        })
      }
    }
  }

  const playAudio = (track: AlbumTrack, cb: (track: AlbumTrack) => Promise<void>, isFromDB = true) => {
    const { audio, _id } = state.playingTrack
    audio.play()
      .then(() => {
        removeLoadingState()
        if (isFromDB) {
          checkAndSetDuration(track, cb)
        } else {
          setTrackDuration({ trackID: _id, duration: audio.duration })
          timeProgressHandler(track, cb)
        }
      })
      .catch(console.error)
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

  const removeLoadingState = () => {
    state.playingTrack.isOnLoading = false
  }

  const checkAndSetDuration = (track: AlbumTrack, cb: (track: AlbumTrack) => Promise<void>) => {
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
    const { trackID, duration } = payload
    const targetTrack = state.currentPlaylist?.tracks.find((track) => (
      track._id === trackID
    ))

    if (targetTrack) {
      targetTrack.duration = duration
    }

    state.playingTrack.duration = duration
  }

  const timeProgressHandler = (track: AlbumTrack, cb: (track: AlbumTrack) => Promise<void>) => {
    const { isOnRepeat, audio, _id } = state.playingTrack
    let isCounterIncremented = false
    audio.ontimeupdate = () => {
      if (!state.playingTrack) {
        throw new Error('No playing track defined')
      }

      if (!state.currentPlaylist) {
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
          const activePlaylist = state.currentPlaylist.tracks
            .filter((t) => !t.isDisabled)

          const currentTrackIndex = activePlaylist
            .findIndex((t) => t._id === _id)

          const nextTrack = activePlaylist[currentTrackIndex + 1]

          if (nextTrack) {
            cb(nextTrack)
          } else {
            state.playingTrack = {} as PlayerTrack
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
      const audioLink = await cloudServices.getTrackDuration(track.path, track.cloudURL)
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
    const { progressLine, progressTime } = payload

    state.playingTrack.progressLine = progressLine
    state.playingTrack.progressTime = progressTime
  }

  const incrementListeningCounter = async (trackID: string) => {
    try {
      await databaseServices.updateEntity(`tracks/${trackID}/listened`)
      updateListeningCounter(trackID)
    } catch (error) {
      throw error
    }
  }

  const updateListeningCounter = (id: string) => {
    const targetTrack = state.currentPlaylist?.tracks.find((track) => (
      track._id === id
    ))

    if (targetTrack) {
      targetTrack.listened += 1
    }
  }

  return {
    setLoadingState,
    checkOrReplacePlaylists,
    playAudio,
    appendTrackToPlaylist
  }
}