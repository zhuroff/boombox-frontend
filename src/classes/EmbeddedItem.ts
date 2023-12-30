import { BasicEntity } from '~/types/Common'
import { EmbeddedItemRes } from '~/types/ReqRes'
import ListCardBasic from './ListCardBasic'

export default class EmbeddedItem extends ListCardBasic {
  readonly _id: string
  title: string
  frame: string
  artist: BasicEntity
  genre: BasicEntity
  period: BasicEntity

  constructor(embedded: EmbeddedItemRes, cardType: string, cardPath: string) {
    super(cardType, cardPath)
    this._id = embedded._id
    this.title = embedded.title
    this.frame = embedded.frame
    this.artist = embedded.artist
    this.genre = embedded.genre
    this.period = embedded.period
  }
}
