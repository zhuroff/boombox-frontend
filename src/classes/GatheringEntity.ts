import ListCardBasic from './ListCardBasic'
import { GatheringEntityRes } from '~/types/ReqRes'
import { hostString } from '~/utils'

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
    
    if (gathering.poster) this.poster = hostString(gathering.poster)
    if (gathering.avatar) this.avatar = hostString(gathering.avatar)
  }
}
