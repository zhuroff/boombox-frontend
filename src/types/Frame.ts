import { ICategoryBasic } from '~/types/Category'

type FrameBasic = {
  title: string
  artist: ICategoryBasic
  genre: ICategoryBasic
  period: ICategoryBasic
  frame: string
}

type FramePage = FrameBasic & {
  _id: string
}

export {
  FrameBasic,
  FramePage
}
