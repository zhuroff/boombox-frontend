import AlbumTrack from './AlbumTrack'

export default class PlayerTrack {
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
  progressLine: number
  progressTime: number
  audio: HTMLAudioElement
  crackle: HTMLAudioElement

  constructor(track: AlbumTrack) {
    this._id = track._id
    this.title = track.title
    this.source = track.path
    this.cloudURL = track.cloudURL
    this.duration = track.duration || 0
    this.artistName = track.artist.title || ''
    this.albumName = track.inAlbum.title || ''
    this.albumID = track.inAlbum._id
    this.year = track.period.title
    this.cover = track.albumCover
    this.isOnPause = false
    this.isOnRepeat = false
    this.isOnLoading = true
    this.progressLine = 0
    this.progressTime = 0
    this.audio = new Audio(track.path || '')
    this.crackle = new Audio('/media/vinyl_01.wav')

    if (track.inAlbum.folderName) {
      this.albumFolder = track.inAlbum.folderName
    }

    this.crackle.loop = true
    this.audio.volume = Number(localStorage.getItem('playerVolume')) || 1
    this.crackle.volume = Number(localStorage.getItem('playerVolume')) || 1
  }
}
