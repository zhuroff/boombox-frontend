import { CategoryEntityRes } from '~/types/ReqRes'

export default class CategoryEntity {
  _id: string
  title: string
  cloudURL?: string
  avatar?: string

  constructor(category: CategoryEntityRes) {
    this._id = category._id
    this.title = category.title
    this.cloudURL = category.cloudURL
    this.avatar = category.avatar
  }
}
