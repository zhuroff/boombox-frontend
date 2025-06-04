import type { AlbumBasic } from '~/entities/album'
import type { Entity } from '~shared/lib'

export type CategoryBasic = Entity & {
  albums: number
  avatar?: string
}

export type CategoryFull = Omit<CategoryBasic, 'albums'> & {
  poster?: string
  albums: AlbumBasic[]
  embeddedAlbums: Entity[]
}
