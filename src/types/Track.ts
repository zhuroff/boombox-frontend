import { AlbumItem } from './Album'
import { CategoryBasic } from './Category'

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
  inPlaylists: CategoryBasic[]
  artist: CategoryBasic
  lyrics?: string
  duration?: number
  cover?: string
}
