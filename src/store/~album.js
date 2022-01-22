import axios from 'axios'

const albumPlaceholder = {
  albumCover: null,
  title: null,
  artist: {},
  releaseYear: null,
  genre: {},
  description: null,
  tracks: []
}

const clearfyFormats = (format) => (
  Array.from(new Set(format))
)

const structurizeDiscogsData = (arr) => {
  return arr.map((el) => {
    const formats = el.formats?.map((x) => x.name) || [el.format[0]]
    el.formats = clearfyFormats(formats)

    return el
  })
}

const Album = {
  state: () => ({
    album: albumPlaceholder,

    discogsData: [],

    discogsPagination: {}
  }),

  mutations: {
    setAlbum: (state, album) => {
      state.album = album
    },

    setDiscogsData: (state, data) => {
      state.discogsData = structurizeDiscogsData(data.results),
      state.discogsPagination = data.pagination
    },

    updateAlbumsTracksOrder: (state, payload) => {
      state.album.tracks.splice(
        payload.newOrder, 0,
        state.album.tracks.splice(payload.oldOrder, 1)[0]
      )
    },

    setAlbumLyrics: (state, payload) => {
      const targetTrack = state.album.tracks.find((el) => (
        el.fileid === payload.fileid
      ))

      if (targetTrack) {
        targetTrack.lyrics = payload.lyrics
      }
    }
  },

  actions: {
    fetchAlbum: async ({ commit, dispatch }, albumID) => {
      commit('setAlbum', albumPlaceholder)
      
      try {
        const response = await axios.get(`/api/albums/${albumID}`)
        commit('setAlbum', response.data)
        commit('setPlayerPlaylist', response.data)
        dispatch('fetchDiscogsData', {
          album: response.data,
          page: 1
        })
      } catch (error) {
        console.error(error.response)
      }
    },

    fetchDiscogsData: async ({ commit }, data) => {
      const payload = {
        artist: data.album.artist.title,
        album: data.album.title,
        page: data.page
      }

      try {
        const response = await axios.post('/api/search/discogs', payload)
        commit('setDiscogsData', response.data)
      } catch (error) {
        console.error(error.resposne)
      }
    }
  },

  getters: {
    album: (state) => state.album,

    albumCovers: (state) => ({
      cover: state.album.albumCover,
      booklet: state.album.albumCoverArt
    }),

    albumHeading: (state) => ({
      title: state.album.title,
      artist: state.album.artist,
      releaseYear: state.album.releaseYear,
      period: state.album.period,
      genre: state.album.genre,
      description: state.album.description
    }),

    discogsData: (state) => state.discogsData,

    discogsPagination: (state) => state.discogsPagination
  }
}

export default Album
