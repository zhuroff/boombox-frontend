import { IAlbumBasic } from '~/types/Album'
import { IFrameBasic } from '~/types/Frame'

interface ICategoryBasic {
  _id: string
  title: string
}

interface ICategoryMedium extends ICategoryBasic {
  albums: number
  avatar: string | undefined
}

interface ICategoryFull extends ICategoryBasic {
  poster: string
  albums: IAlbumBasic[] | IFrameBasic[]
  frames?: IFrameBasic[]
  avatar: string | undefined
}

export {
  ICategoryBasic,
  ICategoryMedium,
  ICategoryFull
}
