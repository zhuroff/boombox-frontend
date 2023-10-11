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

export type DiscogsPagination = {
  items: number
  page: number
  pages: number
  per_page: number
}

export type DiscogsItem = {
  id: number
  catno: string
  country: string
  format: string[]
  label: string[]
  resource_url: string
  title: string
  uri: string
  year: string
}

export type DiscogsResponse = {
  pagination: DiscogsPagination
  results: DiscogsItem[]
}

export type DiscogsData = {
  results: Map<number, DiscogsItem>
  isFetched: boolean
}

export type DiscogsCompanies = {
  id: number
  catno: string
  entity_type_name: string
  name: string
}

export type DiscogsArtists = {
  id: number
  name: string
  role: string
  tracks: string
}

export type DiscogsIdentifiers = {
  description: string
  type: string
  value: string
}

export type DiscogsTracklist = {
  position: string
  duration: string
  title: string
  type_: string
}

export type DiscogsVideos = {
  description: string
  duration: number
  embed: boolean
  title: string
  uri: string
}

export type DiscogsDetails = {
  id: number
  title: string
  notes?: string
  thumb?: string
  released?: string
  styles?: string[]
  companies: DiscogsCompanies[]
  extraartists: DiscogsArtists[]
  identifiers: DiscogsIdentifiers[]
  labels: DiscogsCompanies[]
  tracklist: DiscogsTracklist[]
  videos?: DiscogsVideos[]
  isInvalid?: true
}
