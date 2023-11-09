import { TSnackbar, LocaleKeys } from '~/types/Global'
import { PlayerPlaylist } from '~/types/Player'
import { initPlaylist, playingTrackInitial } from './initStates'
import { PlayerTrackDTO } from '~/dto/AlbumTrackDTO'

export interface AppStateInterface {
  currentPlaylist: PlayerPlaylist
  reservedPlaylist: PlayerPlaylist
  playingTrack: PlayerTrackDTO
  snackbar: TSnackbar[]
  isPlayerExpanded: boolean
  currentLocale: LocaleKeys
}

function state(): AppStateInterface {
  return {
    currentPlaylist: { ...initPlaylist },
    reservedPlaylist: { ...initPlaylist },
    playingTrack: { ...playingTrackInitial },
    snackbar: [],
    isPlayerExpanded: false,
    currentLocale: (localStorage.getItem('locale') as LocaleKeys) || 'en'
  }
}

export default state
