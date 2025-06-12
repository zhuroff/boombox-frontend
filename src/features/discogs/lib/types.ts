export type DiscogsReleaseRow = {
  id: number
  country: string
  cover: string
  releaseFormat: string[]
  label: string[]
  pageURL: string
  releaseTitle: string
  releaseYear: string
}

export type DiscogsQueryConfig = {
  artist: string
  album: string
  page: number
  isMasterOnly?: boolean
}
