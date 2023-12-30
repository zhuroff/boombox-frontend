import { CategoryEntityRes } from '~/types/ReqRes'
import ListCardBasic from './ListCardBasic'

export default abstract class CategoryEntity extends ListCardBasic {
  _id: string
  title: string
  cloudURL: string
  avatar?: string

  constructor(category: CategoryEntityRes, cardType: string, cardPath: string) {
    super(cardType, cardPath)
    this._id = category._id
    this.title = category.title
    this.cloudURL = category.cloudURL
    this.avatar = category.avatar
  }
}
