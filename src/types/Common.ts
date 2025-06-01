import type { Ref } from 'vue'
import type { TrackRes } from '~/types/ReqRes'
import AlbumPage from '~/classes/AlbumPage'
import CompilationPage from '~/classes/CompilationPage'

export interface BasicEntity {
  _id: string
  title: string
  cloudURL?: string
}

export type PlayerPlaylist = AlbumPage | CompilationPage<TrackRes>

export type TableFilter = Record<string, string[]>

export interface Pagination {
  totalDocs: number
  totalPages: number
  page: number
  limit: number
}

export type SortingValue = Record<string, 1 | -1>

export interface DraggableEvent {
  newIndex: number
  oldIndex: number
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
  schema: any
}

export interface AlignmentPosition {
  x: 'right' | 'left'
  y: 'top' | 'bottom'
}

export interface RefPayload<T> {
  refEntityKey: string
  refEntityValue: T
}
