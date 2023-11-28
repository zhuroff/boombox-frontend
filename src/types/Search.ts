import { AlbumItem } from './Album'
import { CategoryItem } from './Category'
import { TrackResponse } from './Track'

export interface SearchPayload {
  query: string
  key?: string
}

export type SearchResultData = CategoryItem | AlbumItem | TrackResponse

export interface SearchResultState {
  title: string
  key: string
  data: SearchResultData[]
}
