import { ICategoryBasic } from '~/types/Category'

interface IFrameBasic {
  _id: string
  title: string
  artist: ICategoryBasic
  genre: ICategoryBasic
  period: ICategoryBasic
  iframe: string
}

export {
  IFrameBasic
}
