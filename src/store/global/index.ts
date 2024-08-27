import { reactive } from 'vue'
import locales from '~/locales'
import actions from './actions'
import getters from './getters'

const state = reactive<GlobalState>({
  currentLocale: 'en',
  authConfig: {},
  locales
})

const useGlobalStore = () => {
  return {
    globalActions: actions(state),
    globalGetters: getters(state)
  }
}

export default useGlobalStore
