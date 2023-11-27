import { AlbumItem } from '~/types/Album'
import { FrameAlbum } from '~/types/Frame'
import { SearchResultData } from './Search'
import { BasicEntity } from './Global'

type CategoryImagesKeys = 'poster' | 'avatar'
type CategoryKeysSingular = 'artist' | 'genre' | 'period'
type CategoryKeysPlural = 'artists' | 'genres' | 'periods'

export type CategoryKeys = Record<CategoryKeysSingular, string>

type CategoryMatcher = {
  [K in CategoryKeysPlural]: CategoryKeysSingular
}

type CategoryItem = BasicEntity & {
  albums: number
  avatar: string | undefined
}

type CategoryPage = BasicEntity & {
  poster: string
  albums: AlbumItem[]
  frames?: FrameAlbum[]
  avatar: string | undefined
}

type CategorySearchResult = BasicEntity & {
  avatar: string
}

type CategoryActive = {
  isActive: boolean,
  isFetched: boolean,
  key: CategoryKeysPlural,
  results: SearchResultData[]
}

export {
  CategoryImagesKeys,
  CategoryMatcher,
  CategoryKeysSingular,
  CategoryKeysPlural,
  CategoryItem,
  CategoryPage,
  CategorySearchResult,
  CategoryActive
}
