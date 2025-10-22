import type { CompilationBasic } from '~entities/compilation'
import type { AlbumBasic } from '~entities/album'
import type { CategoryBasic } from '~entities/category'
import type { TrackBasic } from '~entities/track'
import type { CollectionBasic } from '~entities/collection'

export type SearchPayload = {
  query: string
  key?: string
}

export type SearchResultData = AlbumBasic | CategoryBasic | TrackBasic | CompilationBasic | CollectionBasic

export type SearchResultState = {
  key: string
  data: SearchResultData[]
}
