import { GetterTree } from 'vuex'
import { AppStateInterface } from './state'
import { StateInterface } from '..'
import { findLocaleLangValue } from '~/utils'
import locales from '~/locales'

const getters: GetterTree<AppStateInterface, StateInterface> = {
  playingTrack: (state: AppStateInterface) => state.playingTrack,
  currentPlaylistTracks: (state: AppStateInterface) => state.currentPlaylist.tracks,
  snackbarItems: (state: AppStateInterface) => state.snackbar,
  isPlayerExpanded: (state: AppStateInterface) => state.isPlayerExpanded,
  currentLocale: (state: AppStateInterface) => state.currentLocale,
  getLocaleValue: (state: AppStateInterface) => (path: string, ...vars: Array<string | number>) => {
    const parsedPath = path.split('.')
    const dict = locales.get(state.currentLocale)
    const value = findLocaleLangValue(parsedPath, dict)

    if (!value) return `{${path}}`
    if (!vars.length) return value
    
    return value.replace(/{x}/g, () => String(vars.shift() ?? '{...}'))
  }
}

export default getters
