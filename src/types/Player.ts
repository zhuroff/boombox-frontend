import { ICategoryBasic } from '~/types/Category'
import { IAlbumTrack } from '~/types/Album'

interface IPlaylist {
  _id: string
  albumCover: string
  artist: ICategoryBasic
  period: ICategoryBasic
  title: string
  tracks: IAlbumTrack[]
}

export {
  IPlaylist
}
