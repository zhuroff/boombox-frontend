import { CategoryBasic } from '~/types/Category'
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
  artist?: CategoryBasic
  period?: CategoryBasic
}

export type PlayingTrack = TrackProgress & {
  duration: number | string | null
  isOnPause: boolean
  isOnRepeat: boolean
  artistName: string
  albumName: string
  title: string
  source: string
  year: string
  cover: string
  audio: HTMLAudioElement
  crackle: HTMLAudioElement
  progressHandler: (() => void) | null
  isOnLoading: boolean
  _id: string
}
