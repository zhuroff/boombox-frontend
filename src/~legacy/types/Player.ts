import type { Entity } from '~shared/lib'
import AlbumTrack from '~/classes/AlbumTrack'

export interface Playlist {
  _id: string
  title: string
  tracks: AlbumTrack[]
  albumCover?: string
  artist?: Entity
  period?: Entity
}
