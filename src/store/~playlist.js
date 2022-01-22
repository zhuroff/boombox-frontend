import axios from 'axios'

const playlistPlaceholder = {
  poster: '/img/album.jpg',
  title: null,
  tracks: []
}

const Playlist = {
  state: () => ({
    playlists: [],

    playlist: playlistPlaceholder,

    removingPlaylist: null
  }),

  mutations: {
    setPlaylists: (state, playlists) => {
      state.playlists = playlists
    },

    setPlaylist: (state, playlist) => {
      state.playlist = {
        ...playlist,
        poster: playlist.poster || playlistPlaceholder.poster
      }
    },

    appendPlaylist: (state, playlist) => {
      state.playlists.push(playlist)
    },

    setTracksOrder: (state, payload) => {
      state.playlist.tracks.splice(
        payload.newOrder, 0,
        state.playlist.tracks.splice(payload.oldOrder, 1)[0]
      )
      
      /* eslint no-param-reassign: 0 */
      state.playlist.tracks.forEach((el, index) => {
        el.order = index + 1
      })
    },

    removingState: (state, id) => {
      state.removingPlaylist = id
    },

    deletePlaylist: (state, id) => {
      state.removingPlaylist = null

      const deletedIndex = state.playlists.findIndex((el) => el._id === id)

      if (deletedIndex > -1) {
        state.playlists.splice(deletedIndex, 1)
      }
    },

    updateCover: (state, cover) => {
      state.playlist.poster = cover
    },

    setPlaylistLyrics: (state, payload) => {
      payload.targetTrack.lyrics = payload.lyrics
    }
  },

  actions: {
    fetchPlaylists: async ({ commit }) => {
      try {
        const response = await axios.get('/api/playlists')
        commit('setPlaylists', response.data)
      } catch (error) {
        console.error(error)
      }
    },

    fetchPlaylist: async ({ commit }, playlistID) => {
      try {
        const response = await axios.get(`/api/playlists/${playlistID}`)
        commit('setPlaylist', response.data)
        commit('setPlayerPlaylist', response.data)
      } catch (error) {
        console.error(error)
      }
    },

    createPlaylist: async ({ commit }, payload) => {
      const response = await axios.post('/api/playlists', payload)
      commit('appendPlaylist', response.data)
    },

    updateTracksOrder: async ({ commit }, payload) => {
      commit('setTracksOrder', payload)

      try {
        await axios.patch(`/api/playlists/${payload.playlistID}/order`, payload)
      } catch (error) {
        console.error(error)
      }
    },

    deletePlayList: async ({ commit }, playlist) => {
      commit('removingState', playlist._id)

      const payload = { cover: playlist.poster }

      try {
        await axios.post(`/api/playlists/${playlist._id}/delete`, payload)
        commit('deletePlaylist', playlist._id)
      } catch (error) {
        console.error(error)
      }
    }
  },

  getters: {
    playlists: (state) => state.playlists,

    playlist: (state) => state.playlist,

    playlistCover: (state) => ({
      cover: state.playlist.poster
    }),

    playlistHeading: (state) => ({
      title: state.playlist.title
    }),

    removingPlaylist: (state) => state.removingPlaylist
  }
}

export default Playlist
