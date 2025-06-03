/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}


/*
type RequestConfig = PaginationState & {
  isRandom?: true | 1
  filter?: RandomEntityReqFilter | RelatedAlbumsReqFilter
}

interface UseEntityListPayload {
  entityKey: string
  requestConfig: RequestConfig
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

*/