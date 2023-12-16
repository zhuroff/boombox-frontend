import { BasicEntity } from '~/types/Common'
import { AlbumItemRes } from '~/types/ReqRes'

export default class AlbumItem {
  _id: string
  title: string
  cloudURL: string
  folderName: string
  inCollections: BasicEntity[]
  artist: BasicEntity
  genre: BasicEntity
  period: BasicEntity
  coverURL?: string

  constructor(album: AlbumItemRes) {
    this._id = album._id
    this.title = album.title
    this.cloudURL = album.cloudURL
    this.folderName = album.folderName
    this.inCollections = album.inCollections
    this.artist = album.artist
    this.genre = album.genre
    this.period = album.period
    this.coverURL = album.coverURL
  }
}
