import { BasicEntity } from '~/types/Common'
import { AlbumTrackDTO } from '~/dto/AlbumTrackDTO'

export type TrackProgress = {
  progressLine: number
  progressTime: number
}

export type PlayerPlaylist = {
  _id: string
  title: string
  tracks: AlbumTrackDTO[]
  albumCover?: string
  artist?: BasicEntity
  period?: BasicEntity
}
