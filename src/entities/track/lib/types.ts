import type { Entity } from '~shared/lib'

export type TrackBasic = Entity & {
  duration: number
  path: string
  listened: number
  inAlbum: Entity & {
    artists?: Entity[]
    artist?: Entity
    period: Entity
  }
  artist: Entity
  genre: Entity
  period: Entity
  coverURL?: string
  release?: string | null
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

