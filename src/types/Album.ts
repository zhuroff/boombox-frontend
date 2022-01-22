import { ICategoryBasic } from '~/types/Category'

interface IAlbumTracks {
  _id: string
  fileid: number
  link: string
  listened: number
  title: string
}

interface IAlbumBasic {
  _id: string
  albumCover: string
  title: string
  artist: ICategoryBasic
  genre: ICategoryBasic
  period: ICategoryBasic
}

interface IAlbumFull extends IAlbumBasic {
  albumCoverArt: number
  description: string
  tracks: IAlbumTracks[]
}

export {
  IAlbumBasic,
  IAlbumFull,
  IAlbumTracks
}
