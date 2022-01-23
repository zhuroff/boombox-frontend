import { MutationTree } from 'vuex'
import { AppStateInterface } from './state'
import { IAlbumFull } from '~/types/Album'

const mutations: MutationTree<AppStateInterface> = {
  setPlayerPlaylist: (state: AppStateInterface, data: IAlbumFull) => {
    const {
      _id,
      albumCover,
      artist,
      period,
      title,
      tracks
    } = data

    if (!state.currentPlaylist._id.length) {
      state.currentPlaylist = {
        _id,
        albumCover,
        artist,
        period,
        title,
        tracks
      }
    } else if (state.currentPlaylist._id !== _id) {
      state.reservedPlaylist = {
        _id,
        albumCover,
        artist,
        period,
        title,
        tracks
      }
    }
  }
}

export default mutations
