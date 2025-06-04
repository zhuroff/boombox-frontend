import type { AlbumBasic } from '~entities/album'

export type TOYAlbumBasic = AlbumBasic & {
  metadataContent: any /* MinimumAlbumInfo[] */ | null
}