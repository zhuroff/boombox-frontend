import { ActionTree } from 'vuex'
import { AppStateInterface } from './state'
import { StateInterface } from '..'
import api from '~/api'

const actions: ActionTree<AppStateInterface, StateInterface> = {
  playTrack: ({ commit, dispatch }, fileid: number) => {
    commit('checkOrReplacePlaylists', fileid)
    commit('preparePlayerTrack', fileid)
    commit('createAudioContext')
    dispatch('playAudioTrack', fileid)
  },

  playAudioTrack: ({ commit, dispatch, state }, fileid: number) =>  {
    const playingTrack = state.playingTrack
    const playingAudio = playingTrack.audio

    playingAudio.play()
      .then(() => commit('deleteLoadingState'))
      .then(() => dispatch('incrementListeningCounter'))
      .then(() => {
        dispatch('saveTrackDuration', playingAudio.duration)

        playingAudio.ontimeupdate = () => {
          const progressLine = playingAudio.currentTime / playingAudio.duration
          const progressTime = playingAudio.currentTime

          commit('updateListeningProgress', { progressLine, progressTime })

          if (progressLine >= 1) {
            if (playingTrack.isOnRepeat) {
              dispatch('playAudioTrack', fileid)
            } else {
              const activePlaylist = state.currentPlaylist.tracks
                .filter((track) => !track.isDisabled)

              const currentTrackIndex = activePlaylist
                .findIndex((track) => track.fileid === fileid)
              
              const nextTrack = activePlaylist[currentTrackIndex + 1]

              if (nextTrack) {
                dispatch('playTrack', nextTrack.fileid)
              } else {
                commit('nullifyPlayerTrack')
              }
            }
          }
        }
      })
  },

  incrementListeningCounter: async ({ commit, state }) => {
    const trackID = state.playingTrack._id

    try {
      await api.patch(`/api/tracks/${trackID}/listened`)
      commit('updateListeningCounter', trackID)
    } catch (error) {
      throw error
    }
  },

  saveTrackDuration: async ({ commit, state }, duration: number) => {
    const fileDuration = state.playingTrack.duration
    const trackID = state.playingTrack._id

    if (!fileDuration) {
      try {
        await api.patch(`/api/tracks/${trackID}/duration`, { duration })
        commit('setTrackDuration', { trackID, duration })
      } catch (error) {
        throw error
      }
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
