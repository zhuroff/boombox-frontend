import { CategoryBasic } from './Category'
import { TPagination } from './Global'
import { Track } from './Track'

type AlbumItem = {
  _id: string
  albumCover: string
  title: string
  artist: CategoryBasic
  genre: CategoryBasic
  period: CategoryBasic
  folderid?: number
}

type AlbumPage = AlbumItem & {
  albumCoverArt: number | string[]
  description: string
  tracks: Track[]
  isLoaded: boolean
}

type AlbumPageResponse = {
  docs: AlbumItem[]
  pagination: TPagination
}

type AlbumItemProps = {
  isFetched: boolean
  data: AlbumItem[]
  pagination: TPagination
}

type AlbumPageProps = {
  isFetched: boolean
  data: AlbumPage
}

type AlbumHeadProps = {
  title: string
  artist: CategoryBasic,
  period: CategoryBasic,
  genre: CategoryBasic,
  description: string
}

export {
  AlbumItem,
  AlbumPage,
  AlbumHeadProps,
  AlbumItemProps,
  AlbumPageProps,
  AlbumPageResponse
}
