import { BasicEntity, Pagination } from './Global'

type FramePayload = {
  title: string
  artist: BasicEntity
  genre: BasicEntity
  period: BasicEntity
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
