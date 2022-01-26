import { ICategoryBasic } from '~/types/Category'
import { IAlbumTrack } from '~/types/Album'

interface IPlaylist {
  _id: string
  albumCover: string
  artist: ICategoryBasic
  period: ICategoryBasic
  title: string
  tracks: IAlbumTrack[]
}

interface IPlayingTrack {
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
  progressLine: number
  progressTime: number
  _id: string
}

export {
  IPlaylist,
  IPlayingTrack
}
