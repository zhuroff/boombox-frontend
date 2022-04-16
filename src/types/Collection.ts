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

export {
  ICollectionPayloadPost,
  CollectionListItem
}
