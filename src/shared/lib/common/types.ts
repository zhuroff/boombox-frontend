import type { Pagination, PaginationState } from '~shared/lib'

export type Entity = {
  _id: string
  title: string
  cloudURL?: string
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

export type DeletePayload = {
  id: string
  entityKey: string
}

export type SortingValue = Record<string, 1 | -1>

export type ListPageResponse<T> = {
  docs: T[],
  pagination: Pagination
}

export type MinimumAlbumInfo = {
  albumTitle: string
  albumArtist: string
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

export type RelatedAlbums<T> = {
  name: string
  docs: T[]
}

export type RequestConfig = PaginationState & {
  isRandom?: true | 1
  filter?: RandomEntityReqFilter | RelatedAlbumsReqFilter
}

export type UseEntityListPayload = {
  entityKey: string
  requestConfig: RequestConfig
}

export type DraggableEvent = {
  newIndex: number
  oldIndex: number
}

export type ReorderPayload = {
  oldOrder: number
  newOrder: number
}

export type ElementSize = 'small' | 'medium' | 'large'

export type ElementPosition = 'top' | 'right' | 'bottom' | 'left'
