import { ICategoryBasic } from './Category'
import { IPagination } from './Global'

type IAlbumTrack = {
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

type IAlbumBasic = {
  _id: string
  albumCover: string
  title: string
  artist: ICategoryBasic
  genre: ICategoryBasic
  period: ICategoryBasic
  folderid?: number
}

type IAlbumFull = IAlbumBasic & {
  albumCoverArt: number | string[]
  description: string
  tracks: IAlbumTrack[]
  isLoaded: boolean
}

type AlbumBasicResponse = {
  docs: IAlbumBasic[]
  pagination: IPagination
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
  AlbumBasicResponse,
  AlbumHeadProps
}
