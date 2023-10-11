import { PlayerTrackDTO, AlbumTrackDTO } from '~/dto/AlbumTrackDTO'
import { CategoryBasic } from '~/types/Category'
import { PlayerPlaylist } from '~/types/Player'

const initPlaylist: PlayerPlaylist = {
  _id: '',
  title: '',
  albumCover: '',
  artist: { _id: '', title: '' },
  period: { _id: '', title: '' },
  tracks: []
}

const playingTrackInitial = new PlayerTrackDTO(new AlbumTrackDTO({
  _id: '',
  title: '',
  path: '',
  listened: 0,
  inAlbum: {} as CategoryBasic,
  inPlaylists: [],
  artist: {} as CategoryBasic,
  lyrics: '',
  duration: 0,
}, 0, '', {} as CategoryBasic))

// const playingTrackInitial: PlayingTrack = {
//   progressHandler: null,
// }

export {
  initPlaylist,
  playingTrackInitial
}
