import { Ref } from 'vue'
import { JSONSchema4 } from 'json-schema'

export interface BasicEntity {
  _id: string
  title: string
  cloudURL?: string
}

export type LocaleKeys = 'en' | 'by'
export type EntityImagesKeys = 'poster' | 'avatar'

export interface LocaleDictionary {
  [key: string]: string | LocaleDictionary
}

export type TableFilter = Record<string, string[]>

export interface Pagination {
  totalDocs: number
  totalPages: number
  page: number
  limit: number
}

export interface PaginationConfig {
  limiter?: number[]
  increment?: true
  decrement?: true
  selected?: number
}

export type SortingValue = Record<string, 1 | -1>

export interface DraggableEvent {
  newIndex: number
  oldIndex: number
}

export interface ReorderPayload {
  entityID: string
  oldOrder: number
  newOrder: number
}

export interface Snackbar {
  message: string
  type: 'warning' | 'success' | 'error' | 'info'
  // order: number
  time?: number
}

export interface RequestFilter {
  from: string
  key: string
  value: string
  excluded?: Record<string, string>
}

export interface RequestConfig {
  page: number
  sort: SortingValue
  limit: number
  isRandom?: true
  filter?: RequestFilter
}

export interface ImagePayload {
  file: File
  type: EntityImagesKeys
  slug: string
  id: string
}

export interface UploadImageResult {
  key: EntityImagesKeys
  url: string
}

export interface ResponseMessage {
  message: string | number
}

export type CardBasic = BasicEntity & {
  coverURL: string
  caption: string
}

export interface TableSchemaColumn {
  type: string
}

export interface TableSchema {
  columns: TableSchemaColumn[]
}

export interface TablePayload<T> {
  rows: T[]
  pagination: Pagination
  isFetched: Ref<boolean>
  schema: JSONSchema4
}

export interface WikiSearchResult {
  title: string
  pageid: number
}

export interface AlignmentPosition {
  x: 'right' | 'left'
  y: 'top' | 'bottom'
}

export interface SyncResponse {
  added: number
  updated: number
  deleted: number
  invalid: Record<string, string>[] | 0
}
