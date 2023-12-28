import { CategoryItemRes } from '~/types/ReqRes'
import CategoryEntity from './CategoryEntity'

export default class CategoryItem extends CategoryEntity {
  albums: number

  constructor(category: CategoryItemRes) {
    super(category)
    this.albums = category.albums
  }
}