import { ISnackbar } from '~/types/Global'
import { IPlaylist, IPlayingTrack } from '~/types/Player'
import { initPlaylist, playingTrackInitial } from './initStates'

export interface AppStateInterface {
  currentPlaylist: IPlaylist
  reservedPlaylist: IPlaylist
  playingTrack: IPlayingTrack
  snackbar: ISnackbar[]
}

function state(): AppStateInterface {
  return {
    currentPlaylist: { ...initPlaylist },

    reservedPlaylist: { ...initPlaylist },

    playingTrack: { ...playingTrackInitial },

    snackbar: []
  }
}

export default state
