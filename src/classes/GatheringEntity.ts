import { GatheringEntityRes } from '~/types/ReqRes'

export default abstract class GatheringEntity<T extends GatheringEntityRes> {
  readonly _id: string
  readonly title: string
  readonly dateCreated: string
  poster?: string
  avatar?: string

  constructor(gathering: T) {
    this._id = gathering._id
    this.title = gathering.title
    this.dateCreated = gathering.dateCreated
    this.poster = gathering.poster
    this.avatar = gathering.avatar
  }
}
