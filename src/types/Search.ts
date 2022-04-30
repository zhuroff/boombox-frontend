import { AlbumItem } from './Album'
import { FrameAlbum } from '~/types/Frame'
import { CategorySearchResult } from './Category'

type SearchPayload = {
  query: string
  key?: string
}

type SearchResultData = (CategorySearchResult | AlbumItem | Partial<FrameAlbum>)

type SearchResultState = {
  title: string
  key: string
  data: SearchResultData[]
}

type SearchedResult = {
  isFetching: boolean
  data: SearchResultState[],
  errorMessage: string | null
}

export {
  SearchPayload,
  SearchResultData,
  SearchResultState,
  SearchedResult
}
