import AlbumItem from '~/classes/AlbumItem'
import { BasicEntity, Pagination } from './Common'

export interface TrackRes {
  _id: string
  title: string
  path: string
  cloudURL: string
  coverURL?: string
  duration?: number
  listened?: number
  lyrics?: string
  artist: BasicEntity
  inAlbum: Pick<AlbumItem, '_id' | 'title' | 'cloudURL' | 'folderName' | 'period'>
  inPlaylists?: BasicEntity[]
}

export interface AlbumItemRes extends BasicEntity {
  cloudURL: string
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
  order?: number
}

export interface GatheringUpdateRes {
  entityID: string
  gatheringID: string
  isInList: boolean
  order: number
}
