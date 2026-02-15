export type DiscogsPagination = {
  page: number
  pages: number
  per_page: number
  items: number
}

export type DiscogsCollectionRow = {
  id: number
  count: number
  name: DiscogsCollectionFolderName
  pagination: DiscogsPagination | undefined
  releases: DiscogsReleaseRow[]
}

export type DiscogsReleaseRow = {
  id: number
  artists: { id: number; name: string }[]
  cover_image: string
  date_added: string
  formats: {
    name: string
    descriptions: string[]
  }[]
  genres: string[]
  styles: string[]
  melodymap_link: string | null
  release_url: string
  thumb: string
  title: string
  year: number
  labels: {
    id: number
    name: string
    catno: string
  }[]
}

export type DiscogsTableRow = {
  id: number
  country: string
  cover: string
  releaseFormat: string[]
  label: string[]
  pageURL: string
  releaseTitle: string
  releaseYear: string
}

export enum DiscogsCollectionFolderName {
  Vinyl = 'Vinyl',
  CD = 'CD',
  Cassette = 'Cassette'
}

export type DiscogsCollectionQueryConfig = {
  folderName: DiscogsCollectionFolderName | null
}

export type DiscogsSearchQueryConfig = {
  artist: string
  album: string
  page: number
  isMasterOnly?: 1 | 0
}
