import type { CategoryItemRes } from '~/types/ReqRes'
import CategoryEntity from './CategoryEntity'

export default class CategoryItem extends CategoryEntity {
  albums: number

  constructor(category: CategoryItemRes, cardType: string, cardPath: string) {
    super(category, cardType, cardPath)
    this.albums = category.albums
  }
}
