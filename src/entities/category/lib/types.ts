import type { AlbumBasic } from '~entities/album'
import type { EmbeddedBasic } from '~entities/embedded'
import type { Entity } from '~shared/lib'

export type CategoryBasic = Entity & {
  albums: number
  avatar?: string
  kind: 'category'
}

export type CategoryFull = Omit<CategoryBasic, 'albums'> & {
  poster?: string
  albums: AlbumBasic[]
  embeddedAlbums: EmbeddedBasic[]
}
