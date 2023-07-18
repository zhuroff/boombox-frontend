import { CategoryBasic } from '~/types/Category'
import { Pagination } from './Global'

type FramePayload = {
  title: string
  artist: CategoryBasic
  genre: CategoryBasic
  period: CategoryBasic
  frame: string
}

type FrameAlbum = FramePayload & {
  _id: string
}

type FrameAlbumResponse = {
  docs: FrameAlbum[]
  pagination: Pagination
}

export {
  FramePayload,
  FrameAlbum,
  FrameAlbumResponse
}
