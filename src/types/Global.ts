import { Ref } from "vue";
import { CategoryImagesKeys } from "./Category"
import { JSONSchema4 } from "json-schema";

export type BasicEntity = {
  _id: string;
  title: string;
}

type Pagination = {
  totalDocs: number
  totalPages: number
  page: number
  limit: number
}

export type PaginationConfig = {
  view?: 'buttons' | 'select'
  limiter?: number[]
  increment?: true
  decrement?: true
  selected?: number
}

export type ListPageResponse<T> = {
  docs: T[],
  pagination: Pagination
}

// export type AlbumPageResponse = {

// }

type DropdownOption<T> = {
  title: string,
  value: T,
  isActive: boolean
}

type SortingValue = {
  [key: string]: 1 | -1
}

type DraggableEvent = {
  newIndex: number
  oldIndex: number
}

type ReorderPayload = {
  entityID: string
  oldOrder: number
  newOrder: number
}

type FloatModalCheckAction = {
  inList: boolean
  itemID: string
  listID: string
  order: number
}

type TSnackbar = {
  message: string
  type: 'warning' | 'success' | 'error' | 'info'
  order: number
}

export type RequestFilter = {
  from: string
  key: string
  value: string
  excluded?: Record<string, string>
}

type RequestConfig = {
  page: number
  sort: SortingValue
  limit: number
  isRandom?: true
  filter?: RequestFilter
}

type ImagePayload = {
  file: File
  type: CategoryImagesKeys
  slug: string
  id: string
}

type UploadImageResult = {
  key: CategoryImagesKeys
  url: string
}

type ResponseMessage = {
  message: string | number
}

export type CardBasic = BasicEntity & {
  coverURL: string
  caption: string
}

export type TableSchemaColumn = {
  type: string
}

export type TableSchema = {
  columns: TableSchemaColumn[]
}

export type TablePayload<T> = {
  rows: T[]
  pagination: Pagination
  isFetched: Ref<boolean>
  schema: JSONSchema4
}

export {
  Pagination,
  DropdownOption,
  SortingValue,
  DraggableEvent,
  ReorderPayload,
  FloatModalCheckAction,
  TSnackbar,
  RequestConfig,
  ImagePayload,
  UploadImageResult,
  ResponseMessage
}
