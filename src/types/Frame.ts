import { CategoryBasic } from '~/types/Category'
import { TPagination } from './Global'

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
  pagination: TPagination
}

export {
  FramePayload,
  FrameAlbum,
  FrameAlbumResponse
}
