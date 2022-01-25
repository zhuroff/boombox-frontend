import { IPlaylist, IPlayingTrack } from '~/types/Player'
import { initPlaylist, playingTrackInitial } from './initStates'

export interface AppStateInterface {
  currentPlaylist: IPlaylist
  reservedPlaylist: IPlaylist
  playingTrack: IPlayingTrack
}

function state(): AppStateInterface {
  return {
    currentPlaylist: { ...initPlaylist },

    reservedPlaylist: { ...initPlaylist },

    playingTrack: { ...playingTrackInitial }
  }
}

export default state
