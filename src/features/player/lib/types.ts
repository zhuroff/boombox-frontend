import type { TrackBasic } from '~entities/track'

export type PlaylistTrack = TrackBasic & {
  order: number
  isOnRepeat?: boolean
  streamURL?: string
  isOnPlaying?: boolean
  isOnPause?: boolean
}
