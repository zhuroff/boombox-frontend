import { AlbumItem } from '~/types/Album'
import { BasicEntity } from '~/types/Global'
import { TrackResponse } from '~/types/Track'

export class AlbumTrackDTO implements TrackResponse {
  _id: string
  title: string
  path: string
  listened: number
  inAlbum: AlbumItem
  inPlaylists: BasicEntity[]
  artist: BasicEntity
  period: BasicEntity
  lyrics: string
  duration: number
  isDisabled: boolean
  order: number
  albumCover: string
  isOutOfAlbumList: boolean
  
  constructor(
    track: TrackResponse,
    order: number,
    cover: string,
    period: BasicEntity,
    isOutOfAlbumList = false
  ) {
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
    this.isOutOfAlbumList = isOutOfAlbumList
  }
}

export class PlayerTrackDTO {
  _id: string
  title: string  
  source: string
  duration: number | null
  artistName: string
  albumName: string
  albumID: string
  year: string
  cover: string
  isOnLoading: boolean  
  isOnPause: boolean
  isOnRepeat: boolean
  progressLine: number
  progressTime: number
  audio: HTMLAudioElement
  crackle: HTMLAudioElement

  constructor(track: AlbumTrackDTO) {
    this._id = track._id
    this.title = track.title
    this.source = track.path
    this.duration = track.duration || null
    this.artistName = track.artist.title || ''
    this.albumName = track.inAlbum.title || ''
    this.albumID = track.inAlbum._id
    this.year = track.period.title || ''
    this.cover = track.albumCover
    this.isOnPause = false
    this.isOnRepeat = false
    this.isOnLoading = true
    this.progressLine = 0
    this.progressTime = 0
    this.audio = new Audio()
    this.crackle = new Audio('/media/vinyl_01.wav')
    this.crackle.loop = true
  }
}
