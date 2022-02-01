interface ICollectionPayloadPost {
  title: string
  album: string
}

interface ICollectionAlbumBasic {
  order: number
  album: {
    _id: string
  }
}

interface ICollectionBasic {
  _id: string
  title: string
  albums: ICollectionAlbumBasic[]
}

export {
  ICollectionPayloadPost,
  ICollectionBasic
}
