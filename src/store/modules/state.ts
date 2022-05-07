import { TSnackbar } from '~/types/Global'
import { PlayerPlaylist, PlayingTrack } from '~/types/Player'
import { initPlaylist, playingTrackInitial } from './initStates'

export interface AppStateInterface {
  currentPlaylist: PlayerPlaylist
  reservedPlaylist: PlayerPlaylist
  playingTrack: PlayingTrack
  snackbar: TSnackbar[]
  isPlayerExpanded: boolean
}

function state(): AppStateInterface {
  return {
    currentPlaylist: { ...initPlaylist },
    reservedPlaylist: { ...initPlaylist },
    playingTrack: { ...playingTrackInitial },
    snackbar: [],
    isPlayerExpanded: false
  }
}

export default state
