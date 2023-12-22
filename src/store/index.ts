import { reactive } from 'vue'
import { AppStateInterface, LocaleKeys } from '~/types/Common'
import { useActions } from './actions'
import { useGetters } from './getters'

class State {
  #state = reactive<AppStateInterface>({
    currentPlaylist: null,
    reservedPlaylist: null,
    playingTrack: null,
    snackbar: [],
    isPlayerExpanded: false,
    currentLocale: (localStorage.getItem('locale') as LocaleKeys) || 'en'
  })

  actions = useActions(this.#state)
  getters = useGetters(this.#state)
}

export default new State()
