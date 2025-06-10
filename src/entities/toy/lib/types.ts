import type { MinimumAlbumInfo } from '~shared/lib'
import type { AlbumBasic, AlbumFull } from '~entities/album'

export type TOYAlbumBasic = Omit<AlbumBasic, 'cloudURL'>

export type TOYAlbumFull = Omit<AlbumFull, 'inCollections' | 'cloudURL'> & {
  metadataContent: MinimumAlbumInfo | null
}