import { BasicEntity } from './Common'
import AlbumItem from '~/classes/AlbumItem'
import CompilationItem from '~/classes/CompilationItem'

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

export interface RelatedAlbums {
  name: string
  docs: AlbumItem[]
}

export interface RelatedCompilations {
  name: string
  docs: CompilationItem<BasicEntity>[]
}
