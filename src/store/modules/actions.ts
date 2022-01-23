import { ActionTree } from 'vuex'
import { ExampleStateInterface } from './state'
import { StateInterface } from '..'
import api from '~/api'

interface IDescriptionPayload {
  id: string
  description: string
}

const actions: ActionTree<ExampleStateInterface, StateInterface> = {
  async fetchAlbum({ commit, dispatch }, id: string) {
    try {
      const response = await api.get(`/api/albums/${id}`)
      commit('setAlbum', response?.data)
    } catch (error) {
      throw error
    }
  },

  updateAlbumDescription: async ({}, payload: IDescriptionPayload) => {
    const { description } = payload

    try {
      await api.patch(`/api/albums/${payload.id}/description`, { description })
    } catch (error) {
      throw error
    }
  }
}

export default actions
