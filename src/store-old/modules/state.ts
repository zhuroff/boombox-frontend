// import { Snackbar, LocaleKeys } from '~/types/Common'
// import { PlayerPlaylist } from '~/types/Player'
// import { initPlaylist, playingTrackInitial } from './initStates'
// import { PlayerTrackDTO } from '~/dto/AlbumTrackDTO'

// export interface AppStateInterface {
//   currentPlaylist: PlayerPlaylist
//   reservedPlaylist: PlayerPlaylist
//   playingTrack: PlayerTrackDTO
//   snackbar: Snackbar[]
//   isPlayerExpanded: boolean
//   currentLocale: LocaleKeys
// }

// export default function state(): AppStateInterface {
//   return {
//     currentPlaylist: { ...initPlaylist },
//     reservedPlaylist: { ...initPlaylist },
//     playingTrack: { ...playingTrackInitial },
//     snackbar: [],
//     isPlayerExpanded: false,
//     currentLocale: (localStorage.getItem('locale') as LocaleKeys) || 'en'
//   }
// }

// // export default state
