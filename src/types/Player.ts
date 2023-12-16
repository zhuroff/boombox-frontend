import { BasicEntity } from '~/types/Common'
import AlbumTrack from '~/classes/AlbumTrack'

export type TrackProgress = {
  progressLine: number
  progressTime: number
}

export interface Playlist {
  _id: string
  title: string
  tracks: AlbumTrack[]
  albumCover?: string
  artist?: BasicEntity
  period?: BasicEntity
}
