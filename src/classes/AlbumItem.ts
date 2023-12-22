import { BasicEntity } from '~/types/Common'
import { AlbumItemRes } from '~/types/ReqRes'

export default class AlbumItem {
  readonly _id: string
  readonly title: string
  readonly caption: string
  readonly cloudURL: string
  readonly folderName: string
  readonly inCollections: BasicEntity[]
  readonly artist: BasicEntity
  readonly genre: BasicEntity
  readonly period: BasicEntity
  readonly coverURL?: string

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
    this.caption = `${album.artist.title } / ${album.period.title} / ${album.genre.title}`
  }
}
