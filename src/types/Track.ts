import { AlbumItem } from './Album'
import { CategoryBasic } from './Category'

type TrackLyricsResponse = {
  artist: string
  lyrics: string
  thumbnail: string
  title: string
}

type TrackLyricsData = {
  lyrics: string
}

type Track = {
  _id: string
  link: string
  listened: number
  title: string
  artist: CategoryBasic
  lyrics?: string
  duration?: number | string
  isDisabled?: boolean
  order?: number
  inAlbum?: Partial<AlbumItem>
}

export {
  TrackLyricsResponse,
  TrackLyricsData,
  Track
}
