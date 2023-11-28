import { AlbumItem } from '~/types/Album'
import { FrameAlbum } from '~/types/Frame'
import { BasicEntity } from './Common'

export type CategoryKeysSingular = 'artist' | 'genre' | 'period'
export type CategoryKeysPlural = 'artists' | 'genres' | 'periods'
export type CategoryKeys = Record<CategoryKeysSingular, string>
export type CategoryMatcher = Record<CategoryKeysPlural, CategoryKeysSingular>

export type CategoryItem = BasicEntity & {
  albums: number
  avatar?: string
}

export type CategoryPage = Omit<CategoryItem, 'albums'> & {
  albums: AlbumItem[]
  poster?: string
  frames?: FrameAlbum[]
}
