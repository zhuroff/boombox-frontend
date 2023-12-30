import { CategoryPageRes } from '~/types/ReqRes'
import AlbumItem from './AlbumItem'
import EmbeddedItem from './EmbeddedItem'
import CategoryEntity from './CategoryEntity'

export default class CategoryPage extends CategoryEntity {
  poster?: string
  albums: AlbumItem[]
  embedded?: EmbeddedItem[]

  constructor(category: CategoryPageRes) {
    super(category, '', '')
    this.poster = category.poster
    this.albums = category.albums.map((album) => new AlbumItem(album, 'AlbumCard', 'albums'))
    this.embedded = category.frames?.map((frame) => new EmbeddedItem(frame, 'EmbeddedCard', 'embedded'))
  }
}
