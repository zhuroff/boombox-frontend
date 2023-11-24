import { Ref } from "vue";
import { CategoryImagesKeys } from "./Category"
import { JSONSchema4 } from "json-schema";

export type BasicEntity = {
  _id: string;
  title: string;
}

export type LocaleKeys = 'en' | 'by'

export interface LocaleDictionary {
  [key: string]: string | LocaleDictionary
}

export interface NavbarItem {
  title: string
  route: string
}

export type TableFilter = Record<string, string[]>

type Pagination = {
  totalDocs: number
  totalPages: number
  page: number
  limit: number
}

export type PaginationConfig = {
  limiter?: number[]
  increment?: true
  decrement?: true
  selected?: number
}

export type ListPageResponse<T> = {
  docs: T[],
  pagination: Pagination
}

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

export type WikiSearchResult = {
  title: string
  pageid: number
}

export type AlignmentPosition = {
  x: 'right' | 'left'
  y: 'top' | 'bottom'
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
