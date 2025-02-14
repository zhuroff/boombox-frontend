/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

enum UserRole {
  admin = 'admin',
  developer = 'developer',
  guest = 'guest'
}

interface Entity {
  _id: string
  title: string
  dateCreated?: string
  cloudURL?: string
}

interface Category extends Entity {
  poster?: string
  avatar?: string
  albums: Album[]
  embeddedAlbums?: unknown[]
}

interface Compilation extends Entity {
  avatar?: string
  poster?: string
  tracks: Track[]
}

interface Album extends Entity {
  folderName: string
  artist: Entity
  genre: Entity
  period: Entity
  created?: string
  modified?: string
  coverURL?: string
  tracks: Track[]
  inCollections: Entity[]
}

type AlbumShort = Required<Pick<Album, '_id' | 'title' | 'cloudURL' | 'folderName'>>

interface Embedded extends Entity {
  artist: Entity
  genre: Entity
  period: Entity
  frame: string
  inCollections: Entity[]
}

type UnifiedAlbum = Album | Embedded | Compilation

interface Track extends Entity {
  fileName: string
  created?: string
  modified?: string
  duration?: number
  path: string
  mimeType?: string
  listened: number
  inAlbum: AlbumShort
  inCompilations: Entity[]
  artist: Entity
  genre: Entity
  period: Entity
}

interface User {
  _id: string
  login: string
  email: string
  role: UserRole
  dateCreated: string
}

interface Token {
  _id: string
  user: User
  refreshToken: string
}

/**
 * =================================================================
 * =================================================================
 */

type UserRoles = 'admin' | 'user'
type LocaleKeys = 'en' | 'by'

interface AuthRefreshResponse {
  accessToken: string
  user: UserResponse
}

interface LocaleDictionary {
  [key: string]: string | LocaleDictionary
}

interface Pagination {
  totalDocs: number
  totalPages: number
  page: number
}

type SortingValue = Record<string, 1 | -1>

interface PaginationState extends Pick<Pagination, 'page'> {
  limit: number
  sort: SortingValue
}

interface PaginationConfig {
  limiter?: number[]
  increment?: true
  decrement?: true
  selected?: number
  totalDocs: number,
  totalPages: number
}

type PaginationStateSetter = <T extends keyof PaginationState>(key: T, value: PaginationState[T]) => void

type PaginationConfigSetter = <T extends keyof PaginationConfig>(key: T, value: PaginationConfig[T]) => void

interface RandomEntityReqFilter {
  from: string
  key: string
  name: string
  excluded?: Record<string, string>
}

interface RelatedAlbumsReqFilter extends RandomEntityReqFilter {
  value: string
}

type RequestConfig = PaginationState & {
  isRandom?: true
  filter?: RandomEntityReqFilter | RelatedAlbumsReqFilter
}

interface UseEntityListPayload {
  qEntity: string
  entityKey: string
  requestConfig: RequestConfig
}

interface SyncResponse {
  added: number
  updated: number
  deleted: number
  invalid: Record<string, string>[] | 0
}

interface GlobalState {
  currentLocale: LocaleKeys
  authConfig: AuthConfig
  readonly locales: Map<LocaleKeys, LocaleDictionary> 
}

interface PlayerState {
  currentPlaylist: PlayerPlaylist | null
  reservedPlaylist: PlayerPlaylist | null
  playingTrack: AudioTrack | null
  isPlayerExpanded: boolean
}

interface PlayerPlaylist {
  tracks: AlbumTrack[]
}

interface AuthData {
  login: string
  password: string
}

interface User {
  login: string
  email: string
  role: UserRoles
}

interface UserCreating extends User {
  password: string
  passwordConfirm: string
}

type UserResponse = User & { _id: string }

interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: UserResponse
}

interface AuthConfig {
  isAuthenticated?: boolean
  user?: UserResponse
}

interface ListPageResponse<T> {
  docs: T[],
  pagination: Pagination
}

interface Snackbar {
  message: string
  type: 'warning' | 'success' | 'error' | 'info'
  time?: number
}

interface BasicEntity {
  _id: string
  title: string
  cloudURL?: string
}

interface DeletePayload {
  id: string
  entityKey: string
  isPending?: boolean
}

interface AlbumItem extends Required<BasicEntity> {
  artist: BasicEntity
  genre: BasicEntity
  period: BasicEntity
  tracks: AlbumTrack[]
  inCollections: BasicEntity[]
  coverURL?: string
  folderName: string
}

interface EmbeddedItem extends Omit<AlbumItem, 'tracks'> {
  frame: string
}

interface CollectedItem extends BasicEntity {
  avatar?: string
  poster?: string
}

type UnifiedAlbumPage = AlbumItem | EmbeddedItem | CompilationPage

type UnifiedAlbumEntity = AlbumItem | EmbeddedItem | CompilationItem

// interface RelatedAlbums {
//   name: string
//   docs: AlbumItem[]
// }

// interface RelatedCompilations {
//   name: string
//   docs: CompilationItem<BasicEntity>[]
// }

interface UnifiedRelatedAlbums {
  name: string
  docs: UnifiedAlbumEntity[]
}

interface AlbumTrack extends Required<BasicEntity> {
  artist: Omit<BasicEntity, 'cloudURL'>
  genre: Omit<BasicEntity, 'cloudURL'>
  period: Omit<BasicEntity, 'cloudURL'>
  inAlbum: BasicEntity & { folderName: string }
  duration?: number
  albumCover?: string
  order?: number
  isTOY?: boolean
  inCompilations: BasicEntity[]
  listened: number
  path: string
}

interface AudioTrack {
  _id: string
  title: string  
  source: string
  cloudURL: string
  duration: number
  artistName: string
  albumName: string
  albumID: string
  year: string
  albumFolder?: string
  cover?: string
  isOnLoading: boolean  
  isOnPause: boolean
  isOnRepeat: boolean
  isDisabled: boolean
  progressLine: number
  progressTime: number
  audio: HTMLAudioElement
  crackle: HTMLAudioElement
}

interface TrackProgress {
  progressLine: number
  progressTime: number
}

interface EmbeddedPayload {
  artist: string
  frame: string
  genre: string
  period: string
  title: string
}

interface ReorderPayload {
  entityID: string
  oldOrder: number
  newOrder: number
}

interface GatheringUpdateReq {
  gatheringID: string
  entityType: string
  entityID: string
  isInList: boolean
  order?: number
}

type ElementSize = 'small' | 'medium' | 'large'

type ElementPosition = 'top' | 'right' | 'bottom' | 'left'

interface InputLabelConfig {
  labelText: string
  labelTextPosition?: 'right' | 'left'
  size?: ElementSize
  isError?: boolean
}

interface BaseInputFieldSchema {
  name: string
  id?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  refKey?: string
  defaultValue?: string
  size?: ElementSize
  label?: InputLabelConfig
}

interface TextInputFieldSchema extends BaseInputFieldSchema {
  type: 'text' | 'email' | 'password'
  placeholder?: string
}

interface TextareaInputFieldSchema extends BaseInputFieldSchema {
  type: 'textarea'
  placeholder?: string
  rows?: number
}

interface NumberInputFieldSchema extends BaseInputFieldSchema {
  type: 'number' | 'range'
  minValue?: number
  maxValue?: number
  placeholder?: string
}

interface CheckboxInputFieldSchema extends BaseInputFieldSchema {
  type: 'checkbox' | 'radio'
}

interface FileInputFieldSchema extends BaseInputFieldSchema {
  type: 'file'
}

interface SelectInputFieldSchema extends BaseInputFieldSchema {
  type: 'select' | 'multiselect'
  options: Array<{ label: string, value: string }>
}

type FormSchemaProperty = 
  | TextInputFieldSchema
  | TextareaInputFieldSchema
  | NumberInputFieldSchema
  | CheckboxInputFieldSchema
  | FileInputFieldSchema
  | SelectInputFieldSchema
  
type CustomFormData = Record<string, string | File>

type SearchResultData = AlbumItem | CategoryItem | TrackRes

interface SearchResultState {
  title: string
  key: string
  data: SearchResultData[]
}
