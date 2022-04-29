import { AlbumItem } from './Album'
import { FrameAlbum } from '~/types/Frame'
import { CategoryKeysPlural, CategorySearchResult } from './Category'

type SearchEntityKey = CategoryKeysPlural | 'collections' | 'playlists' | 'albums'

type SearchPayload = {
  query: string
  key?: string
}

type SearchResultData = {
  title: string
  data: (CategorySearchResult | AlbumItem | Partial<FrameAlbum>)[]
}

type SearchResult = {
  [K in SearchEntityKey]: SearchResultData
}

type SearchedData = Map<SearchEntityKey, SearchResultData>

type SearchedResult = {
  isFetching: boolean
  data: SearchedData
}

export {
  SearchEntityKey,
  SearchPayload,
  SearchResult,
  SearchedResult,
  SearchedData
}
