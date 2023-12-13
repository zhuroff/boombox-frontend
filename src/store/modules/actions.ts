import { ActionTree } from 'vuex'
import { AppStateInterface } from './state'
import { StateInterface } from '..'
import { AlbumTrackDTO } from '~/dto/AlbumTrackDTO'
import dbServices from '~/services/database.services'
import cloudServices from '~/services/cloud.services'

const actions: ActionTree<AppStateInterface, StateInterface> = {
  playTrack: async ({ commit, dispatch }, track: AlbumTrackDTO) => {
    commit('setLoadingState', track._id)
    commit('checkOrReplacePlaylists', { commit, track })
    
    try {
      const trackSourceLink: string = await dbServices.getFile('tracks/audio', track.path, track.cloudURL)
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
      })
      .catch(console.error)
  },

  timeProgressHandler({ state, commit, dispatch }) {
    const { isOnRepeat, audio, _id } = state.playingTrack
    let isCounterIncremented = false
    audio.ontimeupdate = () => {
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
  },

  checkAndSetDuration({ state, commit, dispatch }, track: AlbumTrackDTO) {
    const { audio, _id } = state.playingTrack

    if (state.playingTrack.duration) {
      commit('setTrackDuration', { trackID: _id, duration: state.playingTrack.duration })
      dispatch('timeProgressHandler')
    } else if (!audio.duration || audio.duration === Infinity) {
      dispatch('getTrackDuration', { track, audio })
    } else {
      commit('setTrackDuration', { trackID: _id, duration: audio.duration })
      dispatch('timeProgressHandler')
      dispatch('saveTrackDuration', audio.duration)
    }
  },

  incrementListeningCounter: async ({ commit, state }) => {
    const trackID = state.playingTrack._id

    try {
      await dbServices.updateEntity(`tracks/${trackID}/listened`)
      commit('updateListeningCounter', trackID)
    } catch (error) {
      throw error
    }
  },

  getTrackDuration: async ({ dispatch, commit }, { audio, track }: { audio: HTMLAudioElement, track: AlbumTrackDTO }) => {
    if (audio.duration !== Infinity) {
      dispatch('saveTrackDuration', audio.duration)
      dispatch('timeProgressHandler')
    } else {
      const audioLink = await cloudServices.getTrackDuration(track.path, track.cloudURL)
      const pureAudio = new Audio(audioLink)
      pureAudio.onloadedmetadata = function() {
        commit('setTrackDuration', { trackID: track._id, duration: pureAudio.duration })
        dispatch('timeProgressHandler')
        dispatch('saveTrackDuration', pureAudio.duration)
      }
    }
  },

  saveTrackDuration: async ({ commit, state }, duration: number) => {
    if (duration === Infinity) return
    const trackID = state.playingTrack._id

    try {
      await dbServices.updateEntity(`tracks/${trackID}/duration`, { duration })
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
