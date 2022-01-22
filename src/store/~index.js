import { createStore } from 'vuex'
import News from './news'
import Player from './player'
import Album from './album'
import Playlist from './playlist'

export default createStore({
  mutations: {
    setTrackDuration: (state, payload) => {
      let targetTrack

      if (state.Album.album._id === payload.album) {
        targetTrack = state.Album.album.tracks.find((el) => el.fileid === payload.fileid)
      } else if (state.Playlist.playlist._id === payload.album) {
        targetTrack = state.Playlist.playlist.tracks.find((el) => el.fileid === payload.fileid)
      }

      if (targetTrack && !targetTrack.duration) {
        targetTrack.duration = payload.duration
      }
    }
  },

  modules: {
    News,
    Player,
    Album,
    Playlist
  }
})
