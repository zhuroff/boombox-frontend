import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import modules from './modules'
import { AppStateInterface } from '~/store/modules/state'

export interface StateInterface {
  instance: AppStateInterface
}

export const key: InjectionKey<Store<StateInterface>> = Symbol()

export default createStore<StateInterface>({
  modules: {
    instance: modules
  }
})