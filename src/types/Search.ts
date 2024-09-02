import type { TrackRes } from './ReqRes'
import AlbumItem from '~/classes/AlbumItem'
import CategoryItem from '~/classes/CategoryItem'

export interface SearchPayload {
  query: string
  key?: string
}

export type SearchResultData = AlbumItem | CategoryItem | TrackRes

export interface SearchResultState {
  title: string
  key: string
  data: SearchResultData[]
}
