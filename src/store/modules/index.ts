import { Module } from 'vuex'
import { StateInterface } from '~/store'
import state, { ExampleStateInterface } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const modules: Module<ExampleStateInterface, StateInterface> = {
  actions,
  getters,
  mutations,
  state
}

export default modules
