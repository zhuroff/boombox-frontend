import { reactive } from 'vue'
import actions from './actions'
import getters from './getters'

const state = reactive<AudioTrackState>({
  playingTrack: null
})

const usePlayingTrack = () => {
  return {
    trackActions: actions(state),
    trackGetters: getters(state)
  }
}

export default usePlayingTrack
