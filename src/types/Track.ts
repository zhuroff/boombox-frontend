import { BasicEntity } from './Common'
import AlbumItem from '~/classes/AlbumItem'

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
  cloudURL: string
  listened: number
  inAlbum: AlbumItem
  inCompilations: BasicEntity[]
  artist: BasicEntity
  lyrics?: string
  duration?: number
  cover?: string
}
