import type { AlbumBasic } from '~entities/album'
import type { Entity } from '~shared/lib'

export type CompilationAlbum = AlbumBasic & {
  order: number
  post?: string
}

export type CollectionBasic = Entity & {
  avatar?: string
  entities: string[]
  kind: 'collection'
}

export type CollectionFull = CollectionBasic & {
  albums: CompilationAlbum[]
  poster?: string
}
