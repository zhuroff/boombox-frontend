export interface DiscogsReleaseRow {
  id: number
  country: string
  cover: string
  releaseFormat: string[]
  genre: string[]
  label: string[]
  pageURL: string
  releaseTitle: string
  releaseYear: string
}

export interface DiscogsQueryConfig {
  artist: string
  album: string
  page: number
  isMasterOnly?: boolean
}
