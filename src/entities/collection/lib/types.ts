import type { AlbumBasic } from '~entities/album'
import type { Entity } from '~shared/lib'

export type CollectionBasic = Entity & {
  avatar?: string
  entities: string[]
}

export type CollectionFull = CollectionBasic & {
  albums: AlbumBasic[]
  poster?: string
}
