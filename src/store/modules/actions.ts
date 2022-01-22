import { ActionTree } from 'vuex'
import { ExampleStateInterface } from './state'
import { StateInterface } from '..'
import api from '~/api'

const actions: ActionTree<ExampleStateInterface, StateInterface> = {
  async fetchAlbum({ commit, dispatch }, id) {
    try {
      const response = await api.get(`/api/albums/${id}`)
      commit('setAlbum', response?.data)
    } catch (error) {
      throw error
    }
  }
}

export default actions
