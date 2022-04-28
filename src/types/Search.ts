import { AlbumItem } from './Album'
import { FrameAlbum } from '~/types/Frame'
import { CategoryKeysPlural, CategorySearchResult } from './Category'

type SearchEntityKey = CategoryKeysPlural | 'collections' | 'playlists' | 'albums'

type SearchPayload = {
  query: string
  key?: string
}

type SearchResult = {
  [K in SearchEntityKey]: (CategorySearchResult | AlbumItem | Partial<FrameAlbum>)[]
}

export {
  SearchPayload,
  SearchResult
}
