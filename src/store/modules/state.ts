import { TSnackbar } from '~/types/Global'
import { PlayerPlaylist } from '~/types/Player'
import { initPlaylist, playingTrackInitial } from './initStates'
import { PlayerTrackDTO } from '~/dto/AlbumTrackDTO'

export interface AppStateInterface {
  currentPlaylist: PlayerPlaylist
  reservedPlaylist: PlayerPlaylist
  playingTrack: PlayerTrackDTO
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
