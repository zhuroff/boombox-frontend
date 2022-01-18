import { ICategoryBasic } from '~/types/Category'

interface IAlbumBasic {
  _id: string
  albumCover: string
  title: string
  artist: ICategoryBasic
  genre: ICategoryBasic
  period: ICategoryBasic
}

export {
  IAlbumBasic
}
