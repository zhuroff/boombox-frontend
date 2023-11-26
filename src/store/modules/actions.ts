import api from '~/api'
import { ActionTree } from 'vuex'
import { AppStateInterface } from './state'
import { StateInterface } from '..'
import { AlbumTrackDTO } from '~/dto/AlbumTrackDTO'
import DBApiService from '~/services/DBApiService'

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
      commit('createAudioContext')
      dispatch('playAudioTrack', track._id)
    } catch (error) {
      console.error(error)
    }
  },

  playAudioTrack: ({ commit, dispatch, state }, _id: string) => {
    const playingTrack = state.playingTrack
    const playingAudio = playingTrack.audio
    playingAudio.volume = Number(localStorage.getItem('playerVolume')) || 1
    let isCounterIncremented = false

    playingAudio.play()
      .then(() => dispatch('saveTrackDuration', playingAudio.duration))
      .finally(() => {
        commit('removeLoadingState')
        playingAudio.ontimeupdate = () => {
          
          const progressLine = playingAudio.currentTime / playingAudio.duration
          const progressTime = playingAudio.currentTime

          commit('updateListeningProgress', { progressLine, progressTime })

          if (progressLine > 0.75 && !isCounterIncremented) {
            dispatch('incrementListeningCounter')
            isCounterIncremented = true
          }

          if (progressLine >= 1) {
            if (playingTrack.isOnRepeat) {
              dispatch('playAudioTrack', _id)
            } else {
              const activePlaylist = state.currentPlaylist.tracks
                .filter((track) => !track.isDisabled)

              const currentTrackIndex = activePlaylist
                .findIndex((track) => track._id === _id)

              const nextTrack = activePlaylist[currentTrackIndex + 1]

              if (nextTrack) {
                dispatch('playTrack', nextTrack)
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
