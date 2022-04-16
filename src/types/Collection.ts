import { IAlbumBasic } from "./Album"

type ICollectionPayloadPost = {
  title: string
  album: string
}

type CollectionListItemAlbum = {
  order: number
  album: {
    _id: string
  }
}

type CollectionListItem = {
  _id: string
  title: string
  albums: CollectionListItemAlbum[]
}

type CollectionPageItemAlbum = {
  order: number
  _id: string
  album: IAlbumBasic
}

type CollectionPageItem = {
  _id: string
  title: string
  albums: CollectionPageItemAlbum[]
}

export {
  ICollectionPayloadPost,
  CollectionListItem,
  CollectionPageItem
}
