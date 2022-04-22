import { AlbumItem } from './Album'

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
  album: AlbumItem
}

type CollectionPageItem = {
  _id: string
  title: string
  poster?: string
  avatar?: string
  albums: CollectionPageItemAlbum[]
}

export {
  CollectionListItem,
  CollectionPageItem
}
