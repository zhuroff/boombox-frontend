import { Ref } from 'vue'
import { JSONSchema4, JSONSchema4TypeName } from 'json-schema'
import { Pagination } from './Global'

export type DiscogsReleaseRow = {
  id: number
  country: string
  cover: string
  releaseFormat: string[]
  genre: string[]
  style: string[]
  label: string[]
  masterApiUrl: string
  releaseApiUrl: string
  pageURL: string
  releaseTitle: string
  releaseYear: string
}

export type DiscogsData = {
  results: Map<number, DiscogsReleaseRow>
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

export type DiscogsResponse = {
  pagination: Pagination
  data: DiscogsReleaseRow[]
}

export type DiscogsPayload = {
  rows: DiscogsReleaseRow[]
  pagination: Pagination
  isFetched: Ref<boolean>
  schema: DiscogsTableSchema
}

// export class DiscogsTableLocale {
//   country: string
//   cover: string
//   releaseFormat: string
//   genre: string
//   style: string
//   label: string
// }

export class DiscogsTableSchema implements JSONSchema4 {
  type: JSONSchema4TypeName
  title = 'Discogs Schema'
  properties: JSONSchema4
  constructor() {
    this.type = 'object'
    this.properties = {
      cover: {
        type: 'string',
        format: 'uri',
        contentMediaType: 'image/*',
        href: 'pageURL'
      },
      country: {
        type: 'string'
      },
      releaseYear: {
        type: 'string'
      },
      releaseFormat: {
        type: 'array',
        items: {
          type: 'string'
        }
      },
      style: {
        type: 'array',
        items: {
          type: 'string'
        }
      },
      label: {
        type: 'string'
      }
    }
  }
}
