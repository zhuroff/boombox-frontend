import { reactive } from 'vue'
import actions from './actions'
import getters from './getters'

const defaultState = (): PlayerState => ({
  currentPlaylist: null,
  reservedPlaylist: null,
  isPlayerExpanded: false
})

const state = reactive<PlayerState>(defaultState())

const usePlaylist = () => {
  return {
    playerActions: actions(state),
    playerGetters: getters(state)
  }
}

export default usePlaylist
