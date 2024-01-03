import { BasicEntity, Pagination } from './Common'
import AlbumItem from '~/classes/AlbumItem'

export interface TrackRes extends Required<BasicEntity> {
  path: string
  coverURL?: string
  duration?: number
  listened?: number
  lyrics?: string
  artist: BasicEntity
  inAlbum: Pick<AlbumItem, '_id' | 'title' | 'cloudURL' | 'folderName' | 'period'>
  inCompilations?: BasicEntity[]
}

export interface EmbeddedItemRes extends BasicEntity {
  frame: string
  artist: BasicEntity
  genre: BasicEntity
  period: BasicEntity
}

export interface AlbumItemRes extends Required<BasicEntity> {
  folderName: string
  inCollections: BasicEntity[]
  artist: BasicEntity
  genre: BasicEntity
  period: BasicEntity
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

export interface GatheringUpdateReq {
  gatheringID: string
  entityType: string
  entityID: string
  order: number
  isInList: boolean
}

export interface GatheringUpdateRes {
  entityID: string
  gatheringID: string
  isInList: boolean
  order: number
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
