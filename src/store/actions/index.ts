import { AppStateInterface } from '..';
import { LocaleKeys, ReorderPayload, Snackbar } from '~/types/Common';
import { usePlayerActions } from './private.player';
import databaseServices from '~/services/database.services';
import AlbumTrack from '~/classes/AlbumTrack';
import PlayerTrack from '~/classes/PlayerTrack';

export const useActions = (state: AppStateInterface) => {
  const {
    setLoadingState,
    checkOrReplacePlaylists,
    appendTrackToPlaylist,
    playAudio
  } = usePlayerActions(state)

  const playTrack = async (track: AlbumTrack) => {
    setLoadingState(track._id)
    checkOrReplacePlaylists(track)
    
    try {
      const trackSourceLink: string = await databaseServices.getFile('tracks/audio', track.path, track.cloudURL)
      if (!trackSourceLink) {
        throw new Error('Unable to get track source link')
      }
      state.playingTrack = new PlayerTrack(track)
      playAudio(track, playTrack)
    } catch (error) {
      console.error(error)
    }
  }

  const setTrackOnPause = () => {
    state.playingTrack!.isOnPause = true
    state.playingTrack!.audio.pause()
  }

  const continuePlay = () => {
    state.playingTrack!.isOnPause = false
    state.playingTrack!.audio.play()
  }

  const setPosition = (value: number) => {
    try {
      state.playingTrack!.audio.currentTime = value * state.playingTrack!.duration
    } catch (ignore) {
      ignore
    }
  }

  const addTrackToPlaylist = (prop: { track: AlbumTrack, order: number }) => {
    appendTrackToPlaylist(prop)
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

  const setSnackbarMessage = (snackbar: Snackbar) => {
    state.snackbar.push(snackbar)
    setTimeout(() => state.snackbar.splice(0, 1), snackbar.time || 5000)
  }

  const closeSnackbar = (index: number) => {
    state.snackbar.splice(index, 1)
  }
  
  const togglePlayerVisibility = () => {
    state.isPlayerExpanded = !state.isPlayerExpanded
  }

  const playTrackNext = (track: AlbumTrack) => {
    const index = state.currentPlaylist?.tracks.findIndex((track) => (
      track._id === state.playingTrack?._id
    ))

    addTrackToPlaylist({ track, order: index === -1 ? 1 : (index || 0) + 1 })
  }

  const addToEndOfList = (track: AlbumTrack) => {
    const index = state.currentPlaylist?.tracks.length
    addTrackToPlaylist({ track, order: index || 1 })
  }

  const switchToPrevTrack = () => {
    if (!state.currentPlaylist) {
      throw new Error('No current playlist defined')
    }

    const currentTrackIndex = state.currentPlaylist.tracks
      .findIndex((track) => track._id === state.playingTrack?._id)

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
      .findIndex((track) => track._id === state.playingTrack?._id)

    const nextTrack = state.currentPlaylist.tracks[currentTrackIndex + 1]

    if (nextTrack) {
      playTrack(nextTrack)
    }
  }

  const changePlaylistOrder = (payload: ReorderPayload) => {
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
    if (!state.playingTrack) {
      throw new Error('No playing track defined')
    }
    state.playingTrack.isOnRepeat = !state.playingTrack.isOnRepeat
  }

  const setSoundVolume = (value: number) => {
    if (!state.playingTrack) {
      throw new Error('No playing track defined')
    }

    state.playingTrack.audio.volume = value
    state.playingTrack.crackle.volume = value
    localStorage.setItem('playerVolume', String(value))
  }

  const switchMuteState = () => {
    if (!state.playingTrack) {
      throw new Error('No playing track defined')
    }

    state.playingTrack.audio.muted = !state.playingTrack.audio.muted
    state.playingTrack.crackle.muted = !state.playingTrack.crackle.muted
  }

  const disableOrEnableTrack = (id: string) => {
    const targetTrack = state.currentPlaylist?.tracks.find((el) => el._id === id)
      || state.reservedPlaylist?.tracks.find((el) => el._id === id)

    if (targetTrack) {
      targetTrack.isDisabled = !targetTrack.isDisabled
    }
  }

  const setLocale = (locale: LocaleKeys) => {
    state.currentLocale = locale
  }

  const crackleSwitch = () => {
    if (state.playingTrack?.crackle.paused) {
      state.playingTrack.crackle.play()
    } else {
      state.playingTrack && state.playingTrack.crackle.pause()
    }
  }

  return {
    playTrack,
    setTrackOnPause,
    continuePlay,
    setPosition,
    addTrackToPlaylist,
    addAlbumToPlaylist,
    removeTrackFromPlaylist,
    setSnackbarMessage,
    closeSnackbar,
    togglePlayerVisibility,
    playTrackNext,
    addToEndOfList,
    switchToPrevTrack,
    switchToNextTrack,
    changePlaylistOrder,
    changeRepeatState,
    setSoundVolume,
    switchMuteState,
    disableOrEnableTrack,
    setLocale,
    crackleSwitch
  }
}