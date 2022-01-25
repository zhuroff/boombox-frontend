import { ActionTree } from 'vuex'
import { AppStateInterface } from './state'
import { StateInterface } from '..'

const actions: ActionTree<AppStateInterface, StateInterface> = {
  playTrack: ({ commit }, fileid: number) => {
    commit('checkOrReplacePlaylists', fileid)
    commit('preparePlayerTrack', fileid)
    commit('createAudioContext')
    commit('playAudioTrack')
  },

  incrementListeningCounter: async ({ commit }, payload: { albumID: string, fileID: number }) => {
    console.log('Counter increment', payload)
  }
}

export default actions
