import { AlbumTrackDTO } from '~/dto/AlbumTrackDTO'
import { CategoryBasic } from './Category'
import { Pagination } from './Global'

export type AlbumItem = {
  _id: string
  albumCover: string
  title: string
  artist: CategoryBasic
  genre: CategoryBasic
  period: CategoryBasic
}

export type AlbumPage = AlbumItem & {
  folderName: string
  tracks: AlbumTrackDTO[]
}

export type AlbumItemProps = {
  isFetched: boolean
  data: AlbumItem[]
  pagination?: Pagination
}

export type AlbumPageProps = {
  isFetched: boolean
  data: AlbumPage
}

export type AlbumHeadProps = {
  title: string
  artist: CategoryBasic
  period: CategoryBasic
  genre: CategoryBasic
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
