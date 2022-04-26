import { CategoryBasic } from '~/types/Category'
import { Track } from '~/types/Track'

type TrackProgress = {
  progressLine: number
  progressTime: number
}

type PlayerPlaylist = {
  _id: string
  title: string
  tracks: Track[]
  albumCover?: string
  artist?: CategoryBasic
  period?: CategoryBasic
}

type PlayingTrack = TrackProgress & {
  fileid: number | string
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

export {
  TrackProgress,
  PlayerPlaylist,
  PlayingTrack
}
