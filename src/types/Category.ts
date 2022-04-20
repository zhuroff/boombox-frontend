import { AlbumItem } from '~/types/Album'
import { FrameAlbum } from '~/types/Frame'

type CategoryImagesKeys = 'poster' | 'avatar'
type CategoryKeysSingular = 'artist' | 'genre' | 'period'
type CategoryKeysPlural = 'artists' | 'genres' | 'periods'

type CategoryKeys = {
  [K in CategoryKeysSingular] : string
}

type CategoryBasic = {
  _id: string
  title: string
}

type CategoryItem = CategoryBasic & {
  albums: number
  avatar: string | undefined
}

type CategoryPage = CategoryBasic & {
  poster: string
  albums: AlbumItem[] | FrameAlbum[]
  frames?: FrameAlbum[]
  avatar: string | undefined
}

type CategorySearchResult = CategoryBasic & {
  poster: string
  avatar: string
}

export {
  CategoryImagesKeys,
  CategoryKeysSingular,
  CategoryKeysPlural,
  CategoryKeys,
  CategoryBasic,
  CategoryItem,
  CategoryPage,
  CategorySearchResult
}
