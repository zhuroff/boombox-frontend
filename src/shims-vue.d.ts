/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

type UserRoles = 'admin' | 'user'
type LocaleKeys = 'en' | 'by'

interface AuthRefreshResponse {
  accessToken: string
  user: UserResponse
}

interface LocaleDictionary {
  [key: string]: string | LocaleDictionary
}

interface GlobalState {
  currentLocale: LocaleKeys
  authConfig: AuthConfig
  readonly locales: Map<LocaleKeys, LocaleDictionary> 
}

interface PlayerState {
  currentPlaylist: PlayerPlaylist | null
  reservedPlaylist: PlayerPlaylist | null
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

interface AlbumItem extends Required<BasicEntity> {
  artist: BasicEntity
  genre: BasicEntity
  period: BasicEntity
  tracks: AlbumTrack[]
  inCollections: BasicEntity[]
  coverURL?: string
  folderName: string
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

interface AudioTrackState {
  playingTrack: AudioTrack | null
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
