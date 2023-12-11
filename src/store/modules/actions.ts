import { ActionTree } from 'vuex'
import { AppStateInterface } from './state'
import { StateInterface } from '..'
import { AlbumTrackDTO } from '~/dto/AlbumTrackDTO'
import DBApiService from '~/services/DBApiService'
import CloudApiService from '~/services/CloudApiService'

const actions: ActionTree<AppStateInterface, StateInterface> = {
  playTrack: async ({ commit, dispatch }, track: AlbumTrackDTO) => {
    commit('setLoadingState', track._id)
    commit('checkOrReplacePlaylists', { commit, track })
    
    try {
      const trackSourceLink: string = await DBApiService.getFile('tracks/audio', track.path)
      if (!trackSourceLink) {
        throw new Error('Unable to get track source link')
      }
      commit('preparePlayerTrack', { ...track, path: trackSourceLink })
      dispatch('playAudioTrack', track)
    } catch (error) {
      console.error(error)
    }
  },

  playAudioTrack: ({ commit, dispatch, state }, track: AlbumTrackDTO) => {
    const { audio } = state.playingTrack
    audio.play()
      .then(() => {
        commit('removeLoadingState')
        dispatch('checkAndSetDuration', track)
        dispatch('timeProgressHandler')
      })
      .catch(console.error)
  },

  timeProgressHandler({ state, commit, dispatch }) {
    const { isOnRepeat, audio, _id } = state.playingTrack
    let isCounterIncremented = false
    audio.ontimeupdate = () => {
      if (state.playingTrack.duration) {
        const progressLine = audio.currentTime / state.playingTrack.duration
        const progressTime = audio.currentTime

        commit('updateListeningProgress', { progressLine, progressTime })

        if (progressLine > 0.75 && !isCounterIncremented) {
          dispatch('incrementListeningCounter')
          isCounterIncremented = true
        }

        if (progressLine >= 1) {
          if (isOnRepeat) {
            dispatch('playAudioTrack', _id)
          } else {
            const activePlaylist = state.currentPlaylist.tracks
              .filter((t) => !t.isDisabled)

            const currentTrackIndex = activePlaylist
              .findIndex((t) => t._id === _id)

            const nextTrack = activePlaylist[currentTrackIndex + 1]

            if (nextTrack) {
              dispatch('playTrack', nextTrack)
            } else {
              commit('nullifyPlayerTrack')
            }
          }
        }
      }
    }
  },

  checkAndSetDuration({ state, commit, dispatch }, track: AlbumTrackDTO) {
    const { audio, _id } = state.playingTrack

    if (state.playingTrack.duration) {
      commit('setTrackDuration', { trackID: _id, duration: state.playingTrack.duration })
    } else if (!audio.duration || audio.duration === Infinity) {
      dispatch('getTrackDuration', { track, audio })
    } else {
      commit('setTrackDuration', { trackID: _id, duration: audio.duration })
      dispatch('saveTrackDuration', audio.duration)
    }
  },

  incrementListeningCounter: async ({ commit, state }) => {
    const trackID = state.playingTrack._id

    try {
      await DBApiService.updateEntity(`tracks/${trackID}/listened`)
      commit('updateListeningCounter', trackID)
    } catch (error) {
      throw error
    }
  },

  getTrackDuration: async ({ dispatch, commit }, { audio, track }: { audio: HTMLAudioElement, track: AlbumTrackDTO }) => {
    if (audio.duration !== Infinity) {
      dispatch('saveTrackDuration', audio.duration)
    } else {
      const audioLink = await CloudApiService.getTrackDuration(track.path)
      const pureAudio = new Audio(audioLink)
      pureAudio.onloadedmetadata = function() {
        commit('setTrackDuration', { trackID: track._id, duration: pureAudio.duration })
        dispatch('saveTrackDuration', pureAudio.duration)
      }
    }
  },

  saveTrackDuration: async ({ commit, state }, duration: number) => {
    if (duration === Infinity) return
    const trackID = state.playingTrack._id

    try {
      await DBApiService.updateEntity(`tracks/${trackID}/duration`, { duration })
      commit('setTrackDuration', { trackID, duration })
    } catch (error) {
      throw error
    }
  },

  crackleSwitch: ({ state }) => {
    if (state.playingTrack.crackle.paused) {
      state.playingTrack.crackle.play()
    } else {
      state.playingTrack.crackle.pause()
    }
  }
}

export default actions
