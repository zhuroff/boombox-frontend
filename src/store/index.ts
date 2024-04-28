import { reactive } from 'vue'
import { AuthConfig } from '~/types/User'
import { AppStateInterface, LocaleKeys, PlayerPlaylist } from '~/types/Common'
import { useActions } from './actions'
import { useGetters } from './getters'
import PlayerTrack from '~/classes/PlayerTrack'

class State {
  #state = reactive<AppStateInterface>({
    authConfig: {} as AuthConfig,
    currentPlaylist: {} as PlayerPlaylist,
    reservedPlaylist: {} as PlayerPlaylist,
    playingTrack: {} as PlayerTrack,
    snackbar: [],
    isPlayerExpanded: false,
    currentLocale: (localStorage.getItem('locale') as LocaleKeys) || 'en'
  })

  actions = useActions(this.#state)
  getters = useGetters(this.#state)
}

export default new State()
