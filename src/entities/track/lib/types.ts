import type { Entity } from '~shared/lib'

export type TrackBasic = Entity & {
  duration: number
  path: string
  listened: number
  inAlbum: Entity
  artist: Entity
  genre: Entity
  period: Entity
}