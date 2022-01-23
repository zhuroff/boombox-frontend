import { ICategoryBasic } from '~/types/Category'
import { IAlbumTracks } from '~/types/Album'

interface IPlaylist {
  _id: string
  albumCover: string
  artist: ICategoryBasic
  period: ICategoryBasic
  title: string
  tracks: IAlbumTracks[]
}

export {
  IPlaylist
}
