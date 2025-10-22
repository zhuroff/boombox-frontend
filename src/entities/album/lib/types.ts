import type { Entity } from '~shared/lib'
import type { TrackBasic } from '~entities/track'

export type AlbumBasic = Entity & {
  artist: Entity
  genre: Entity
  period: Entity
  coverURL?: string
  path: string
  kind: 'album'
}

export type AlbumFull = AlbumBasic & {
  tracks: TrackBasic[]
  inCollections?: Entity[]
}