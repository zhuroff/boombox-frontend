import { BasicEntity } from '~/types/Common'
import { TrackRes } from '~/types/ReqRes'
import AlbumItem from './AlbumItem'

export default class AlbumTrack {
  readonly _id: string
  readonly title: string
  readonly path: string
  readonly cloudURL: string
  readonly inAlbum: Pick<AlbumItem, '_id' | 'title' | 'cloudURL' | 'folderName'>
  readonly artist: BasicEntity
  readonly period: BasicEntity
  readonly genre: BasicEntity
  readonly albumCover: string
  readonly isTOY?: boolean
  lyrics: string
  duration: number
  isDisabled: boolean
  order: number
  listened: number
  isOutOfAlbumList: boolean
  inCompilations?: BasicEntity[]
  
  constructor(
    track: TrackRes,
    order: number,
    cover = '/img/album.webp',
    isOutOfAlbumList = false
  ) {
    this._id = track._id
    this.title = track.title
    this.path = track.path
    this.cloudURL = track.cloudURL
    this.listened = track.listened || 0
    this.inAlbum = track.inAlbum
    this.artist = track.artist
    this.period = track.period
    this.genre = track.genre
    this.lyrics = track.lyrics || ''
    this.duration = track.duration || 0
    this.isDisabled = false
    this.order = order
    this.albumCover = cover
    this.isOutOfAlbumList = isOutOfAlbumList

    if (track.inCompilations) {
      this.inCompilations = track.inCompilations
    }

    if (track.isTOY) {
      this.isTOY = track.isTOY
    }
  }
}
