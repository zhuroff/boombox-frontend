import { CategoryImagesKeys } from "./Category"

export type BasicEntity = {
  _id: string;
  title: string;
}

type Pagination = {
  totalDocs: number
  totalPages: number
  page: number
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

type RequestConfig = {
  page: number
  sort: SortingValue,
  limit: number
  isRandom?: true
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
