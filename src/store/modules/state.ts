import { IPlaylist } from '~/types/Player'

const initPlaylist: IPlaylist = {
  _id: '',
  title: '',
  albumCover: '',
  artist: { _id: '', title: '' },
  period: { _id: '', title: '' },
  tracks: []
}

export interface AppStateInterface {
  currentPlaylist: IPlaylist
  reservedPlaylist: IPlaylist
}

function state(): AppStateInterface {
  return {
    currentPlaylist: { ...initPlaylist },

    reservedPlaylist: { ...initPlaylist }
  }
}

export default state
