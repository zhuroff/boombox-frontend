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

export interface AlbumItemRes {
  _id: string
  title: string
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

export interface ListPageResponse<T> {
  docs: T[],
  pagination: Pagination
}
