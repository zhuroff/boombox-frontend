import { computed } from 'vue'
import { AppStateInterface } from '~/types/Common'
import { findLocaleLangValue } from '~/utils'
import locales from '~/locales'

export const useGetters = (state: AppStateInterface) => {
  const authConfig = computed(() => state.authConfig)
  
  const playingTrack = computed(() => state.playingTrack)

  const playlists = computed(() => ({
    current: state.currentPlaylist,
    reserved: state.reservedPlaylist
  }))

  const currentPlaylistTracks = computed(() => (
    state.currentPlaylist?.tracks || []
  ))

  const snackbarItems = computed(() => state.snackbar)

  const isPlayerExpanded = computed(() => state.isPlayerExpanded)

  const currentLocale = computed(() => state.currentLocale)

  const isNextTrackExists = computed(() => {
    const playingTrackIndex = currentPlaylistTracks.value
      .findIndex((track) => track._id === playingTrack.value?._id)

    return playingTrackIndex < currentPlaylistTracks.value.length - 1
  })

  const isPrevTrackExists = computed(() => {
    const playingTrackIndex = currentPlaylistTracks.value
      .findIndex((track) => track._id === playingTrack.value?._id)

    return playingTrackIndex > 0
  })

  const getLocaleValue = (path: string, ...vars: string[]) => {
    const parsedPath = path.split('.')
    const dict = locales.get(currentLocale.value)
    const value = findLocaleLangValue(parsedPath, dict)

    if (!value) return `{${path}}`
    if (!vars.length) return value
    
    return value.replace(/{x}/g, () => String(vars.shift() ?? '{...}'))
  }

  const showState = computed(() => state)

  return {
    authConfig,
    playingTrack,
    playlists,
    isNextTrackExists,
    isPrevTrackExists,
    currentPlaylistTracks,
    snackbarItems,
    isPlayerExpanded,
    currentLocale,
    getLocaleValue,
    showState
  }
}
