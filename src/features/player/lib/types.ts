import type { TrackBasic } from '~entities/track'

export type PlaylistTrack = TrackBasic & {
  order: number
  albumKind: string
  albumId: string
  idDisabled?: boolean
  albumCover?: string
  isOnRepeat?: boolean
  streamURL?: string
  isOnPlaying?: boolean
  isOnPause?: boolean
}
