import { ICategoryBasic } from '~/types/Category'
import { IPagination } from './Global'

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

type FrameBasicResponse = {
  docs: FramePage[]
  pagination: IPagination
}

export {
  FrameBasic,
  FramePage,
  FrameBasicResponse
}
