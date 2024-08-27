import { BasicEntity } from '~/types/Common'
import AlbumTrack from '~/classes/AlbumTrack'

export interface Playlist {
  _id: string
  title: string
  tracks: AlbumTrack[]
  albumCover?: string
  artist?: BasicEntity
  period?: BasicEntity
}
