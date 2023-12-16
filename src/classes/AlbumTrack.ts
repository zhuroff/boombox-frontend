import { BasicEntity } from '~/types/Common'
import { TrackRes } from '~/types/ReqRes'
import AlbumItem from './AlbumItem'

export default class AlbumTrack {
  _id: string
  title: string
  path: string
  cloudURL: string
  listened: number
  inAlbum: Pick<AlbumItem, '_id' | 'title' | 'cloudURL' | 'folderName'>
  inPlaylists: BasicEntity[]
  artist: BasicEntity
  period: BasicEntity
  lyrics: string
  duration: number
  isDisabled: boolean
  order: number
  albumCover?: string
  isOutOfAlbumList: boolean
  
  constructor(
    track: TrackRes,
    order: number,
    period: BasicEntity,
    cover?: string,
    isOutOfAlbumList = false
  ) {
    this._id = track._id
    this.title = track.title
    this.path = track.path
    this.cloudURL = track.cloudURL
    this.listened = track.listened || 0
    this.inAlbum = track.inAlbum
    this.inPlaylists = track.inPlaylists || []
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
