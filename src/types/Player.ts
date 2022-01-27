import { ICategoryBasic } from '~/types/Category'
import { IAlbumTrack } from '~/types/Album'

interface IOrderPayload {
  oldOrder: number
  newOrder: number
  playlistID: string
}

interface ITrackProgress {
  progressLine: number
  progressTime: number
}

interface IPlaylist {
  _id: string
  albumCover: string
  artist: ICategoryBasic
  period: ICategoryBasic
  title: string
  tracks: IAlbumTrack[]
}

interface IPlayingTrack extends ITrackProgress {
  fileid: number
  duration: number | string | null
  isOnPause: boolean
  isOnRepeat: boolean
  artistName: string
  albumName: string
  title: string
  source: string
  year: string
  cover: string
  audio: HTMLAudioElement
  progressHandler: (() => void) | null
  isOnLoading: boolean
  _id: string
}

export {
  IOrderPayload,
  ITrackProgress,
  IPlaylist,
  IPlayingTrack
}
