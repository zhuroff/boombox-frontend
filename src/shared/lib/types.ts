import type { AlbumBasic } from '~entities/album'

export type Entity = {
  _id: string
  title: string
  cloudURL?: string
}

export type DeletePayload = {
  id: string
  entityKey: string
}

export type DropdownItem = {
  path: string
  value: string
  icon?: string
}

export type MinimumAlbumInfo = {
  albumTitle: string
  albumArtist: string
}

export type Option = {
  label: string
  value: string
}

export type RandomEntityReqFilter = {
  from: string
  key: string
  name: string
  excluded?: Record<string, string>
}

export type RelatedAlbumsReqFilter = RandomEntityReqFilter & {
  value: string
}

export type RequestConfig = PaginationState & {
  isRandom?: true | 1
  filter?: RandomEntityReqFilter | RelatedAlbumsReqFilter
}

export type UseEntityListPayload = {
  entityKey: string
  requestConfig: RequestConfig
}



// export type Track = Entity & {
//   fileName: string
//   created?: string
//   modified?: string
//   duration?: number
//   path: string
//   mimeType?: string
//   listened: number
//   inAlbum: Album
//   inCompilations: Entity[]
//   artist: Entity
//   genre: Entity
//   period: Entity
// }



export type GatheringUpdateReq = {
  gatheringID: string
  entityType: string
  entityID: string
  isInList: boolean
  order?: number
}

type SearchResultData = Album | Category | Track

export type SearchResultState = {
  key: string
  data: SearchResultData[]
}

export type SortingValue = Record<string, 1 | -1>

export type DraggableEvent = {
  newIndex: number
  oldIndex: number
}

export type ReorderPayload = {
  entityID: string
  oldOrder: number
  newOrder: number
}

export type GatheringCreateReq<T> = {
  entityType: string
  entityID: string
  results: T[]
}

export type CloudEntity = Omit<Entity, '_id'> & {
  id: string
  created: string
  modified: string
  path: string
  cover: string
  routePath: string
  mimeType?: string
}

export type TrackRes = Required<Entity> & {
  path: string
  coverURL?: string
  duration?: number
  listened?: number
  lyrics?: string
  order?: number
  isTOY?: boolean
  artist: Entity
  genre: Entity
  period: Entity
  inAlbum: AlbumBasic
  inCompilations?: Entity[]
}

export type SyncResponse = {
  added: AlbumBasic[]
  updated: AlbumBasic[]
  deleted: AlbumBasic[]
  invalid: Record<string, string>[]
}

export type Pagination = {
  totalDocs: number
  totalPages: number
  page: number
}

export type TableConfig<T, U> = {
  rows: T[]
  schema: U
  pagination?: Pagination
  setPagination?: (payload: Partial<Pagination>) => void
}

export type TableCellConfig<T, U> = {
  key: string
  value: T
  schema: U
}

export type TableHeadConfig<T> = {
  key: string
  heading: string
  schema: T | undefined
  filter: T | undefined
}

export type TableFilters = Record<string, string[]>

export type ListPageResponse<T> = {
  docs: T[],
  pagination: Pagination
}

export type Snackbar = {
  message: string
  type: 'warning' | 'success' | 'error' | 'info'
  time?: number
}

export type RelatedAlbums<T> = {
  name: string
  docs: T[]
}

export type ElementSize = 'small' | 'medium' | 'large'

export type ElementPosition = 'top' | 'right' | 'bottom' | 'left'

export type SearchPayload = {
  query: string
  key?: string
}

export type FormPayload = Record<string, string | File>