import AlbumItem from '~/classes/AlbumItem'
import { BasicEntity } from './Common'
// import AlbumTrack from '~/classes/AlbumTrack'

// export interface AlbumItem {
//   _id: string
//   coverURL: string
//   albumCover: string
//   title: string
//   folderName: string
//   artist: BasicEntity
//   genre: BasicEntity
//   period: BasicEntity
// }

// export interface AlbumPage extends AlbumItem {
//   tracks: AlbumTrack[]
// }

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
