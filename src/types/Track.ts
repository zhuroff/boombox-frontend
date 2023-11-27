import { AlbumItem } from './Album'
import { BasicEntity } from './Global'

export type TrackLyricsResponse = {
  artist: string
  lyrics: string
  thumbnail: string
  title: string
}

export type TrackLyricsData = {
  lyrics: string
}

export type TrackResponse = {
  _id: string
  title: string
  path: string
  listened: number
  inAlbum: AlbumItem
  inPlaylists: BasicEntity[]
  artist: BasicEntity
  lyrics?: string
  duration?: number
  cover?: string
}
