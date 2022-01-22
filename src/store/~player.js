import axios from 'axios'

function progressListener(state) {
  state.playingTrack.progress = state.trackElement.currentTime / state.trackElement.duration
  state.playingTrack.progressTime = state.trackElement.currentTime

  if (state.playingTrack.progress >= 1) {
    if (state.playingTrack.isRepeat) {
      state.trackElement.play()
      return
    }

    const finishedTrackID = state.playingTrack.fileid
    const activeTracks = state.currentPlaylist.tracks.filter((el) => !el.isDisabled)
    const finishedTrackIndex = activeTracks.findIndex((el) => el.fileid === finishedTrackID)
    const nextTrack = activeTracks[finishedTrackIndex + 1]

    if (nextTrack) {
      this.dispatch('playTrack', {
        playlist: state.currentPlaylist,
        ...nextTrack
      })
    } else {
      state.trackElement = null
      state.progressHandler = null
      state.playingTrack = { isOnPause: false }
    }
  }
}

const trackArtist = (playlist, fileid) => {
  if (playlist.artist) {
    return playlist.artist.title
  }

  const targetTrack = playlist.tracks.find((el) => el.fileid === fileid)

  if (targetTrack) return targetTrack.artist.title
  return 'Untitled artist'
}

const trackAlbum = (playlist, fileid) => {
  if (playlist.title) {
    return playlist.title
  }

  const targetTrack = playlist.tracks.find((el) => el.fileid === fileid)

  if (targetTrack) return targetTrack.album.title
  return 'Untitled album'
}

const trackName = (tracks, fileid) => {
  const targetTrack = tracks.find((el) => el.fileid === fileid)

  if (targetTrack) return targetTrack.title || targetTrack.track
  return 'Untitled track'
}

const trackYear = (playlist, fileid) => {
  if (playlist.releaseYear) {
    return playlist.releaseYear
  }

  const targetTrack = playlist.tracks.find((el) => el.fileid === fileid)

  if (targetTrack) return targetTrack.album.releaseYear
  return 'Unknown year'
}

const trackCover = (playlist, fileid) => {
  if (playlist.albumCover) {
    return playlist.albumCover
  }

  const targetTrack = playlist.tracks.find((el) => el.fileid === fileid)

  if (targetTrack) return targetTrack.album.albumCover
  return 'https://sverigesradio.se/dist/images/album-cover-placeholder-light.png'
}

const trackAlbumID = (album, fileid) => {
  if (!album.isPlaylist) {
    return album._id
  }

  const targetTrack = album.tracks.find((el) => el.fileid === fileid)

  if (targetTrack) return targetTrack.album._id
  return null
}

const Player = {
  state: () => ({
    loadingTrack: null,

    currentPlaylist: null,

    reservedPlaylist: null,

    playingTrack: { isOnPause: false },

    trackElement: null,
    
    progressHandler: null,

    vinylCrackleElement: null,

    soundOff: false,

    prevTrack: null,

    nextTrack: null
  }),

  mutations: {
    setLoadingTrack: (state, value) => {
      state.loadingTrack = value
    },

    setListened: (state, fileid) => {
      const targetTrack = state.currentPlaylist.tracks.find((el) => el.fileid === fileid)

      if (targetTrack) {
        targetTrack.listened += 1
      }
    },

    setPlayerPlaylist: (state, playlist) => {
      if (!state.currentPlaylist) {
        if (!state.reservedPlaylist) {
          state.currentPlaylist = playlist
        } else {
          state.reservedPlaylist = playlist
        }
      } else {
        state.reservedPlaylist = playlist
      }
    },

    resetPlayerPlaylist: (state, playlistID) => {
      if (playlistID !== state.currentPlaylist._id) {
        state.currentPlaylist = state.reservedPlaylist
      }

      state.reservedPlaylist = null
    },

    startTrack(state, payload) {
      state.playingTrack = { isOnPause: false }
      state.playingTrack.order = payload.order
      state.playingTrack.fileid = payload.fileid
      state.playingTrack.duration = payload.duration
      state.playingTrack.isRepeat = state.playingTrack.isRepeat || false
      state.playingTrack.artist = trackArtist(state.currentPlaylist, payload.fileid)
      state.playingTrack.album = trackAlbum(state.currentPlaylist, payload.fileid)
      state.playingTrack.title = trackName(state.currentPlaylist.tracks, payload.fileid)
      state.playingTrack.year = trackYear(state.currentPlaylist, payload.fileid)
      state.playingTrack.cover = trackCover(state.currentPlaylist, payload.fileid)

      if (state.progressHandler) {
        state.trackElement.removeEventListener('timeupdate', state.progressHandler)
        state.progressHandler = null
      }

      if (!state.trackElement) {
        state.trackElement = new Audio(payload.link)
      } else {
        state.trackElement.src = payload.link
      }

      state.progressHandler = progressListener.bind(this, state)

      state.trackElement.play()
        .then(() => {
          this.dispatch('updateListened', {
            track: payload.fileid,
            album: trackAlbumID(state.currentPlaylist, payload.fileid)
          }).then(() => {
            if (!state.playingTrack.duration) {
              state.playingTrack.duration = state.trackElement.duration
  
              this.dispatch('updateTrackDuration', {
                duration: state.trackElement.duration,
                fileid: payload.fileid,
                album: trackAlbumID(state.currentPlaylist, payload.fileid)
              })
            }
          })
          
          state.trackElement.addEventListener('timeupdate', state.progressHandler)
          state.loadingTrack = null
        })
    },

    startStation: (state, payload) => {
      if (state.playingTrack.fileid === payload.fileid) {
        if (state.playingTrack.isOnPause) {
          state.playingTrack.isOnPause = false
          state.trackElement.play()
        } else {
          state.playingTrack.isOnPause = true
          state.trackElement.pause()
        }

        return true
      }

      state.playingTrack = payload

      if (!state.trackElement) {
        state.trackElement = new Audio(payload.url)
      } else {
        state.trackElement.src = payload.url
      }

      return state.trackElement.play()
    },

    setPrevNextTracks: (state) => {
      const playingTrack = state.playingTrack.fileid
      const activeTracks = state.currentPlaylist.tracks.filter((el) => !el.isDisabled)
      const prevTrack = activeTracks.reduce((acc, next, index, arr) => {
        if (next.fileid === playingTrack && arr[index - 1]) {
          Object.keys(arr[index - 1]).forEach((key) => {
            acc[key] = arr[index - 1][key]
          })
        }

        return acc
      }, {})

      const nextTrack = activeTracks.reduce((acc, next, index, arr) => {
        if (next.fileid === playingTrack && arr[index + 1]) {
          Object.keys(arr[index + 1]).forEach((key) => {
            acc[key] = arr[index + 1][key]
          })
        }

        return acc
      }, {})

      state.prevTrack = prevTrack.fileid ? prevTrack : null
      state.nextTrack = nextTrack.fileid ? nextTrack : null
    },

    setPauseState: (state, value) => {
      state.playingTrack.isOnPause = value

      if (state.trackElement) {
        if (value) {
          state.trackElement.pause()
        } else {
          state.trackElement.play()
        }
      }
    },

    setRepeatState: (state) => {
      state.playingTrack.isRepeat = !state.playingTrack.isRepeat
    },

    setPosition: (state, value) => {
      state.trackElement.currentTime = value * state.trackElement.duration
    },

    vinylCrackleSwitch: (state) => {
      if (state.vinylCrackleElement) {
        if (state.vinylCrackleElement.paused) {
          state.vinylCrackleElement.play()
        } else {
          state.vinylCrackleElement.pause()
        }
      } else {
        state.vinylCrackleElement = new Audio('/media/vinyl_01.wav')
        state.vinylCrackleElement.play()
        state.vinylCrackleElement.loop = true
      }
    },

    soundOnOff: (state) => {
      state.soundOff = !state.soundOff
      state.trackElement.muted = state.soundOff
    },

    setSoundVolume: (state, value) => {
      state.trackElement.volume = value
    },

    disableTrack: (state, payload) => {
      const targetTrack = state.currentPlaylist.tracks.find((el) => el._id === payload.trackID)
        || state.reservedPlaylist.tracks.find((el) => el._id === payload.trackID)

      if (targetTrack) {
        targetTrack.isDisabled = !targetTrack.isDisabled
      }
    }
  },

  actions: {
    playTrack: ({ commit }, payload) => {
      commit('setLoadingTrack', payload.fileid)
      commit('resetPlayerPlaylist', payload.playlist._id)
      commit('startTrack', payload)
      commit('setPrevNextTracks')
    },

    playStation: ({ commit }, payload) => {
      const playingTrack = {
        fileid: payload.stationuuid,
        cover: payload.favicon || '/img/vinyl.png',
        title: payload.name,
        isOnPause: false,
        url: payload.url_resolved
      }

      commit('startStation', playingTrack)
    },

    updateTrackDuration: async ({ commit }, payload) => {
      commit('setTrackDuration', payload)

      try {
        await axios.patch(`/api/albums/${payload.album}/duration`, payload)
      } catch (error) {
        console.error(error)
      }
    },

    updateListened: async ({ commit }, payload) => {
      try {
        await axios.patch(`/api/albums/${payload.album}/listened`, { fileid: payload.track })
        commit('setListened', payload.track)
      } catch (error) {
        console.error(error)
      }
    }
  },

  getters: {
    currentPlaylist: (state) => state.currentPlaylist,

    loadingTrack: (state) => state.loadingTrack,

    currentSoundVolume: (state) => state.trackElement.volume,

    playingTrack: (state) => state.playingTrack,

    isTrackRepeat: (state) => state.playingTrack.isRepeat,

    crackleElement: (state) => state.vinylCrackleElement,

    isSoundOff: (state) => state.soundOff,

    prevTrack: (state) => state.prevTrack,

    nextTrack: (state) => state.nextTrack
  }
}

export default Player
