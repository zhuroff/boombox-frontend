import { GetterTree } from 'vuex'
import { AppStateInterface } from './state'
import { StateInterface } from '..'

const getters: GetterTree<AppStateInterface, StateInterface> = {
  playingTrack: (state: AppStateInterface) => state.playingTrack,
  currentPlaylistTracks: (state: AppStateInterface) => state.currentPlaylist.tracks,
  snackbarItems: (state: AppStateInterface) => state.snackbar,
  isPlayerExpanded: (state: AppStateInterface) => state.isPlayerExpanded
}

export default getters
