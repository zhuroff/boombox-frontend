import { GatheringEntityRes } from '~/types/ReqRes'
import ListCardBasic from './ListCardBasic'

export default abstract class GatheringEntity<T extends GatheringEntityRes> extends ListCardBasic {
  readonly _id: string
  readonly title: string
  readonly dateCreated: string
  poster?: string
  avatar?: string

  constructor(gathering: T, cardType: string, cardPath: string) {
    super(cardType, cardPath)
    this._id = gathering._id
    this.title = gathering.title
    this.dateCreated = gathering.dateCreated
    this.poster = gathering.poster
    this.avatar = gathering.avatar
  }
}
