import { reactive } from 'vue'
import { LocaleKeys, Snackbar } from '~/types/Common'
import { useActions } from './actions'
import { useGetters } from './getters'
import AlbumPage from '~/classes/AlbumPage'
import PlayerTrack from '~/classes/PlayerTrack'
import CompilationEntity from '~/classes/CompilationEntity'
import AlbumTrack from '~/classes/AlbumTrack'

export interface AppStateInterface {
  currentPlaylist: AlbumPage | CompilationEntity<AlbumTrack> | null
  reservedPlaylist: AlbumPage | CompilationEntity<AlbumTrack> | null
  playingTrack: PlayerTrack | null
  snackbar: Snackbar[]
  isPlayerExpanded: boolean
  currentLocale: LocaleKeys
}

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
