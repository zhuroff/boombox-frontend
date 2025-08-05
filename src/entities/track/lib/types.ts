import type { Entity } from '~shared/lib'

export type TrackBasic = Entity & {
  duration: number
  path: string
  listened: number
  inAlbum: Entity
  artist: Entity
  genre: Entity
  period: Entity
}

export type ExternalTrackLyricsResponse = {
  artist: string
  lyrics: string
  thumbnail: string
  title: string
}

export type TrackLyricsResponse = {
  lyrics: string | null
}

