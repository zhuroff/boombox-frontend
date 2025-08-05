import type { AlbumBasic } from '~entities/album'

// export type Track = Entity & {
//   fileName: string
//   created?: string
//   modified?: string
//   duration?: number
//   path: string
//   mimeType?: string
//   listened: number
//   inAlbum: Album
//   inCompilations: Entity[]
//   artist: Entity
//   genre: Entity
//   period: Entity
// }

export type TrackRes = Required<Entity> & {
  path: string
  coverURL?: string
  duration?: number
  listened?: number
  lyrics?: string
  order?: number
  isTOY?: boolean
  artist: Entity
  genre: Entity
  period: Entity
  inAlbum: AlbumBasic
  inCompilations?: Entity[]
}
