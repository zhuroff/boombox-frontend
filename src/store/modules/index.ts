import { Module } from 'vuex'
import { StateInterface } from '~/store'
import state, { AppStateInterface } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const modules: Module<AppStateInterface, StateInterface> = {
  actions,
  getters,
  mutations,
  state
}

export default modules
