import { IAlbumBasic } from '~/types/Album'
import { FrameBasic } from '~/types/Frame'

type CategoryImagesKeys = 'poster' | 'avatar'
type CategoryKeysSingular = 'artist' | 'genre' | 'period'
type CategoryKeysPlural = 'artists' | 'genres' | 'periods'

type CategoryKeys = {
  artist: string
  genre: string
  period: string
}

type ICategoryBasic = {
  _id: string
  title: string
}

interface ICategoryMedium extends ICategoryBasic {
  albums: number
  avatar: string | undefined
}

interface ICategoryFull extends ICategoryBasic {
  poster: string
  albums: IAlbumBasic[] | FrameBasic[]
  frames?: FrameBasic[]
  avatar: string | undefined
}

type CategorySearchResult = ICategoryBasic & {
  poster: string
  avatar: string
}

export {
  CategoryImagesKeys,
  CategoryKeysSingular,
  CategoryKeysPlural,
  CategoryKeys,
  ICategoryBasic,
  ICategoryMedium,
  ICategoryFull,
  CategorySearchResult
}
