import { GetterTree } from 'vuex'
import { AppStateInterface } from './state'
import { StateInterface } from '..'

const getters: GetterTree<AppStateInterface, StateInterface> = {
  playingTrack: (state: AppStateInterface) => state.playingTrack,
  currentPlaylistTracks: (state: AppStateInterface) => state.currentPlaylist.tracks
}

export default getters