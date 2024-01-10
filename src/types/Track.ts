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
