import type { Entity } from '~shared/lib'
import type { TrackBasic } from '~entities/track'

export type AlbumBasic = Entity & {
  artists: Entity[]
  genre: Entity
  period: Entity
  coverURL?: string
  path: string
  kind: 'album'
}

export type AlbumFull = AlbumBasic & {
  tracks: TrackBasic[]
  note?: string
  inCollections?: Entity[]
}