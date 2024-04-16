import { BasicEntity } from '~/types/Common'
import { AlbumItemRes } from '~/types/ReqRes'
import ListCardBasic from './ListCardBasic'

export default class AlbumItem extends ListCardBasic {
  readonly _id: string
  readonly title: string
  readonly cloudURL?: string
  readonly folderName?: string
  readonly inCollections?: BasicEntity[]
  readonly caption?: string
  readonly artist?: BasicEntity
  readonly genre?: BasicEntity
  readonly period?: BasicEntity
  readonly coverURL?: string

  constructor(album: AlbumItemRes, cardType: string, cardPath: string) {
    super(cardType, cardPath)
    this._id = album._id
    this.title = album.title
    this.cloudURL = album.cloudURL
    this.folderName = album.folderName
    this.inCollections = album.inCollections
    this.artist = album.artist
    this.genre = album.genre
    this.period = album.period
    this.coverURL = album.coverURL

    if (album.artist && album.period && album.genre) {
      this.caption = `${album.artist.title } / ${album.period.title} / ${album.genre.title}`
    }
  }
}
