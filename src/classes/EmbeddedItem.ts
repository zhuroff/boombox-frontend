import { BasicEntity } from '~/types/Common';
import { EmbeddedItemRes } from '~/types/ReqRes';

export default class EmbeddedItem {
  frame: string
  artist: BasicEntity
  genre: BasicEntity
  period: BasicEntity

  constructor(frame: EmbeddedItemRes) {
    this.frame = frame.frame
    this.artist = frame.artist
    this.genre = frame.genre
    this.period = frame.period
  }
}
