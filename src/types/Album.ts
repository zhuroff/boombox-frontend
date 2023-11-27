import { AlbumTrackDTO } from '~/dto/AlbumTrackDTO'
import { BasicEntity, Pagination } from './Global'

export interface AlbumItem {
  _id: string
  coverURL: string
  albumCover: string
  title: string
  artist: BasicEntity
  genre: BasicEntity
  period: BasicEntity
}

export interface AlbumPage extends AlbumItem {
  folderName: string
  tracks: AlbumTrackDTO[]
}

export interface AlbumHeadProps {
  title: string
  artist: BasicEntity
  period: BasicEntity
  genre: BasicEntity
}

export interface AlbumBooklet {
  id: string
  created: string
  mimeType: string
  modified: string
  path: string
  title: string
  url: string
}

export interface BookletSlideState {
  currentSlideIndex: number
  prevSlideIndex: number
  slidesCount: number
  slidingToIndex: number
}
