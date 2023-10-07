import { CategoryBasic } from './Category'
import { Pagination } from './Global'
import { Track } from './Track'

type AlbumItem = {
  _id: string
  albumCover: string
  title: string
  artist: CategoryBasic
  genre: CategoryBasic
  period: CategoryBasic
}

type AlbumPage = AlbumItem & {
  folderName: string
  tracks: Track[]
}

// type AlbumPageResponse = {
//   docs: AlbumItem[]
//   pagination: Pagination
// }

type AlbumItemProps = {
  isFetched: boolean
  data: AlbumItem[]
  pagination?: Pagination
}

type AlbumPageProps = {
  isFetched: boolean
  data: AlbumPage
}

type AlbumHeadProps = {
  title: string
  artist: CategoryBasic
  period: CategoryBasic
  genre: CategoryBasic
}

type DiscogsPagination = {
  items: number
  page: number
  pages: number
  per_page: number
}

type DiscogsItem = {
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

type DiscogsResponse = {
  pagination: DiscogsPagination
  results: DiscogsItem[]
}

type DiscogsData = {
  results: Map<number, DiscogsItem>
  isFetched: boolean
}

type DiscogsCompanies = {
  id: number
  catno: string
  entity_type_name: string
  name: string
}

type DiscogsArtists = {
  id: number
  name: string
  role: string
  tracks: string
}

type DiscogsIdentifiers = {
  description: string
  type: string
  value: string
}

type DiscogsTracklist = {
  position: string
  duration: string
  title: string
  type_: string
}

type DiscogsVideos = {
  description: string
  duration: number
  embed: boolean
  title: string
  uri: string
}

type DiscogsDetails = {
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

export {
  AlbumItem,
  AlbumPage,
  AlbumHeadProps,
  AlbumItemProps,
  AlbumPageProps,
  // AlbumPageResponse,
  DiscogsPagination,
  DiscogsItem,
  DiscogsResponse,
  DiscogsData,
  DiscogsCompanies,
  DiscogsDetails
}
