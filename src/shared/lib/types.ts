export type Entity = {
  _id: string
  title: string
  dateCreated?: string
  cloudURL?: string
}

export type DeletePayload = {
  id: string
  entityKey: string
}

export type DropdownItem = {
  path: string
  value: string
  icon?: string
}

export type MinimumAlbumInfo = {
  albumTitle: string
  albumArtist: string
}

export type Option = {
  label: string
  value: string
}

export type Album = Entity & {
  folderName: string
  artist: Entity
  genre: Entity
  period: Entity
  created?: string
  modified?: string
  coverURL?: string
  tracks: Track[]
  path: string
  inCollections?: Entity[]
}

export type TOYAlbum = Omit<Album, 'inCollections'> & {
  metadataContent: MinimumAlbumInfo[] | null
}

export type Track = Entity & {
  fileName: string
  created?: string
  modified?: string
  duration?: number
  path: string
  mimeType?: string
  listened: number
  inAlbum: Album
  inCompilations: Entity[]
  artist: Entity
  genre: Entity
  period: Entity
}

export type Embedded = Entity & {
  artist: Entity
  genre: Entity
  period: Entity
  frame: string
  inCollections?: Entity[]
}

export type GatheringBasic = Entity & {
  avatar?: string
  entities: string[]
}

export type GatheringUpdateReq = {
  gatheringID: string
  entityType: string
  entityID: string
  isInList: boolean
  order?: number
}

export type Compilation = GatheringBasic & {
  poster?: string
  tracks: Track[]
}

export type UnifiedAlbum = Album | Embedded | Compilation | TOYAlbum

export type Category = Entity & {
  poster?: string
  avatar?: string
  albums: Album[]
  embeddedAlbums?: Embedded[]
}

type SearchResultData = Album | Category | Track

export type SearchResultState = {
  key: string
  data: SearchResultData[]
}

export type SortingValue = Record<string, 1 | -1>

export type DraggableEvent = {
  newIndex: number
  oldIndex: number
}

export type ReorderPayload = {
  entityID: string
  oldOrder: number
  newOrder: number
}

export type GatheringCreateReq<T> = {
  entityType: string
  entityID: string
  results: T[]
}

export type CloudEntity = Omit<Entity, '_id'> & {
  id: string
  created: string
  modified: string
  path: string
  cover: string
  routePath: string
  mimeType?: string
}

export type TrackRes = Required<Entity> & {
  path: string
  coverURL?: string
  duration?: number
  listened?: number
  lyrics?: string
  order?: number
  isTOY?: boolean
  artist: Entity
  genre: Entity
  period: Entity
  inAlbum: Pick<Album, '_id' | 'title' | 'cloudURL' | 'folderName' | 'period' | 'genre'>
  inCompilations?: Entity[]
}

export type SyncResponse = {
  added: Album[]
  updated: Album[]
  deleted: Album[]
  invalid: Record<string, string>[]
}

export type Pagination = {
  totalDocs: number
  totalPages: number
  page: number
}

export type TableConfig<T, U> = {
  rows: T[]
  schema: U
  pagination?: Pagination
  setPagination?: (payload: Partial<Pagination>) => void
}

export type TableCellConfig<T, U> = {
  key: string
  value: T
  schema: U
}

export type TableHeadConfig<T> = {
  key: string
  heading: string
  schema: T | undefined
  filter: T | undefined
}

export type TableFilters = Record<string, string[]>

export type ListPageResponse<T> = {
  docs: T[],
  pagination: Pagination
}

export type Snackbar = {
  message: string
  type: 'warning' | 'success' | 'error' | 'info'
  time?: number
}

export type RelatedAlbums = {
  name: string
  docs: Album[]
}

export enum UserRole {
  admin = 'admin',
  listener = 'listener',
  guest = 'guest'
}

export interface User {
  _id: string
  login: string
  email: string
  role: UserRole
  dateCreated: string
}

export type AuthRefreshResponse = {
  user: User
  accessToken: string
  refreshToken: string
}

export type ElementSize = 'small' | 'medium' | 'large'

export type ElementPosition = 'top' | 'right' | 'bottom' | 'left'

export type SearchPayload = {
  query: string
  key?: string
}