import { Ref } from 'vue'
import { JSONSchema4, JSONSchema4TypeName } from 'json-schema'
import { Pagination, TableFilter } from './Common'

export interface DiscogsReleaseRow {
  id: number
  country: string
  cover: string
  releaseFormat: string[]
  genre: string[]
  label: string[]
  masterApiUrl: string
  releaseApiUrl: string
  pageURL: string
  releaseTitle: string
  releaseYear: string
}

export interface DiscogsData {
  results: Map<number, DiscogsReleaseRow>
  isFetched: boolean
}

export interface DiscogsCompanies {
  id: number
  catno: string
  entity_type_name: string
  name: string
}

export interface DiscogsArtists {
  id: number
  name: string
  role: string
  tracks: string
}

export interface DiscogsIdentifiers {
  description: string
  type: string
  value: string
}

export interface DiscogsTracklist {
  position: string
  duration: string
  title: string
  type_: string
}

export interface DiscogsVideos {
  description: string
  duration: number
  embed: boolean
  title: string
  uri: string
}

export interface DiscogsResponse {
  pagination: Pagination
  data: DiscogsReleaseRow[]
}

export interface DiscogsTablePayload {
  rows: DiscogsReleaseRow[]
  pagination: Pagination
  isFetched: Ref<boolean>
  schema: DiscogsTableSchema
  set: (payload: Partial<Pagination>) => void
}

export interface DiscogsQueryConfig {
  artist: string
  album: string
  page: number
}

export interface DiscogsFilter extends TableFilter {
  country: string[]
  releaseYear: string[]
  releaseFormat: string[]
  label: string[]
}

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
      label: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    }
  }
}
