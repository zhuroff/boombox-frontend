import type { BasicEntity } from './Common'

export interface AlbumHeadProps {
  title: string
  artist: BasicEntity
  period: BasicEntity
  genre: BasicEntity
}

export interface AlbumBooklet {
  id: string
  created: string
  mimeType?: string
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
