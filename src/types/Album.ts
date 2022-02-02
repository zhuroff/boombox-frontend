import { ICategoryBasic } from '~/types/Category'

interface IAlbumTrack {
  _id: string
  fileid: number
  link: string
  listened: number
  title: string
  artist: ICategoryBasic
  lyrics?: string
  duration?: number | string
  isDisabled?: boolean
  order?: number
}

interface IAlbumBasic {
  _id: string
  albumCover: string
  title: string
  artist: ICategoryBasic
  genre: ICategoryBasic
  period: ICategoryBasic
  folderid?: number
}

interface IAlbumFull extends IAlbumBasic {
  albumCoverArt: number | string[]
  description: string
  tracks: IAlbumTrack[]
  isLoaded: boolean
}

type AlbumHeadProps = {
  title: string
  artist: ICategoryBasic,
  period: ICategoryBasic,
  genre: ICategoryBasic,
  description: string
}

export {
  IAlbumBasic,
  IAlbumFull,
  IAlbumTrack,
  AlbumHeadProps
}
