import { PlayerTrackDTO, AlbumTrackDTO } from '~/dto/AlbumTrackDTO'
import { AlbumItem } from '~/types/Album'
import { BasicEntity } from '~/types/Global'
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
  inAlbum: {} as AlbumItem,
  inPlaylists: [],
  artist: {} as BasicEntity,
  lyrics: '',
  duration: 0,
}, 0, '', {} as BasicEntity))

export {
  initPlaylist,
  playingTrackInitial
}
