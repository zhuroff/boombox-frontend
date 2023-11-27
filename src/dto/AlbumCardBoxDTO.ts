import { AlbumItem } from '~/types/Album'

export class AlbumCardBoxDTO {
  _id: string
  title: string
  coverURL: string
  caption: string

  constructor(data: AlbumItem) {
    this._id = data._id
    this.title = data.title
    this.coverURL = data.coverURL
    this.caption = `${data.artist.title } / ${data.period.title} / ${data.genre.title}`
  }
}
