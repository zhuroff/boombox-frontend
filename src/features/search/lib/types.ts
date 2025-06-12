import type { AlbumBasic } from '~entities/album'
import type { CategoryBasic } from '~entities/category'
import type { TrackBasic } from '~entities/track'

export type SearchPayload = {
  query: string
  key?: string
}

export type SearchResultData = AlbumBasic | CategoryBasic | TrackBasic

export type SearchResultState = {
  key: string
  data: SearchResultData[]
}
