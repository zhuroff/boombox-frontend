import { CategoryBasic } from '~/types/Category';
import { TrackResponse } from '~/types/Track';

export class AlbumTrackDTO implements TrackResponse {
  _id: string
  title: string
  path: string
  listened: number
  inAlbum: CategoryBasic
  inPlaylists: CategoryBasic[]
  artist: CategoryBasic
  period: CategoryBasic
  lyrics: string
  duration: number
  isDisabled: boolean
  order: number
  albumCover: string
  
  constructor(track: TrackResponse, order: number, cover: string, period: CategoryBasic) {
    this._id = track._id
    this.title = track.title
    this.path = track.path
    this.listened = track.listened
    this.inAlbum = track.inAlbum
    this.inPlaylists = track.inPlaylists
    this.artist = track.artist
    this.lyrics = track.lyrics || ''
    this.duration = track.duration || 0
    this.isDisabled = false
    this.order = order
    this.period = period
    this.albumCover = cover
  }
}

export class PlayerTrackDTO {
  _id: string
  title: string  
  source: string
  duration: number | null
  artistName: string
  albumName: string
  year: string
  cover: string
  isOnLoading: boolean  
  isOnPause: boolean
  isOnRepeat: boolean
  progressLine: number
  progressTime: number
  // progressHandler: (() => void) | null
  audio: HTMLAudioElement
  crackle: HTMLAudioElement

  constructor(track: AlbumTrackDTO) {
    this._id = track._id
    this.title = track.title
    this.source = track.path
    this.duration = track.duration || null
    this.artistName = track.artist.title || ''
    this.albumName = track.inAlbum.title || ''
    this.year = track.period.title || ''
    this.cover = track.albumCover
    this.isOnPause = false
    this.isOnRepeat = false
    this.isOnLoading = true
    this.progressLine = 0
    this.progressTime = 0
    // this.progressHandler = null
    this.audio = new Audio()
    this.crackle = new Audio('/media/vinyl_01.wav')
    this.crackle.loop = true
  }
}
