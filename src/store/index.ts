import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import modules from './modules'
import { ExampleStateInterface } from '~/store/modules/state'

export interface StateInterface {
  instance: ExampleStateInterface
}

export const key: InjectionKey<Store<StateInterface>> = Symbol()

export default createStore<StateInterface>({
  modules: {
    instance: modules
  }
})