import { BasicEntity } from '~/types/Common';
import { EmbeddedItemRes } from '~/types/ReqRes';

export default class EmbeddedItem {
  readonly _id: string
  title: string
  frame: string
  artist: BasicEntity
  genre: BasicEntity
  period: BasicEntity

  constructor(frame: EmbeddedItemRes) {
    this._id = frame._id
    this.title = frame.title
    this.frame = frame.frame
    this.artist = frame.artist
    this.genre = frame.genre
    this.period = frame.period
  }
}
