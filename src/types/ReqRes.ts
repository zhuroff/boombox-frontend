import type { BasicEntity, Pagination } from '~/types/Common'
import AlbumItem from '~/classes/AlbumItem'

export interface TrackRes extends Required<BasicEntity> {
  path: string
  coverURL?: string
  duration?: number
  listened?: number
  lyrics?: string
  order?: number
  isTOY?: boolean
  artist: BasicEntity
  genre: BasicEntity
  period: BasicEntity
  inAlbum: Pick<AlbumItem, '_id' | 'title' | 'cloudURL' | 'folderName' | 'period' | 'genre'>
  inCompilations?: BasicEntity[]
}

export interface EmbeddedItemRes extends BasicEntity {
  frame: string
  artist: BasicEntity
  genre: BasicEntity
  period: BasicEntity
}

export interface AlbumItemRes extends BasicEntity {
  folderName?: string
  inCollections?: BasicEntity[]
  artist?: BasicEntity
  genre?: BasicEntity
  period?: BasicEntity
  coverURL?: string
}

export interface AlbumPageRes extends AlbumItemRes {
  tracks: TrackRes[]
}

export interface GatheringEntityRes extends BasicEntity {
  dateCreated: string
  poster?: string
  avatar?: string
}

export interface CompilationEntityRes<T> extends GatheringEntityRes {
  tracks: T[]
}

export interface CollectionEntityRes<T> extends GatheringEntityRes {
  albums: T[]
}

export interface ListPageResponse<T> {
  docs: T[],
  pagination: Pagination
}

export interface GatheringCreateReq<T> {
  entityType: string
  entityID: string
  results: T[]
}

export interface GatheringCreateRes {
  entityID: string
  title: string
}

export interface GatheringUpdateRes {
  entityID: string
  gatheringID: string
  isInList: boolean
  order?: number
}

export interface CategoryEntityRes extends Required<BasicEntity> {
  avatar?: string
}

export interface CategoryItemRes extends CategoryEntityRes {
  albums: number  
}

export interface CategoryPageRes extends CategoryEntityRes {
  poster?: string
  albums: AlbumItemRes[]
  embeddedAlbums?: EmbeddedItemRes[]
}

export interface CloudEntity extends Omit<BasicEntity, '_id'> {
  id: string
  created: string
  modified: string
  path: string
  cover: string
  routePath: string
  mimeType?: string
}

export interface CloudEntityRes {
  limit: number
  offset: number
  total: number
  items: CloudEntity[]
}

export interface CloudEntityReq {
  path: string
  cloudURL: string
  root?: string
}

export interface CloudEntityReqExt extends CloudEntityReq {
  limit?: number
  offset?: number
}

export interface CloudEntityReqRandom extends CloudEntityReqExt {
  criteria: string
  exclude: string
  value: string
}

export interface CloudEntityReqFile extends CloudEntityReq {
  type: string
  entityType: string
}

export interface CloudFolderResponse<T> {
  items: T[]
  limit: number
  offset: number
  total: number
}
