interface IPlaylistPayloadPost {
  title: string
  track: string
}

interface IPlaylistTrackBasic {
  order: number
  track: string,
}

type PlayListItem = {
  _id: string
  title: string
  tracks: IPlaylistTrackBasic[]
}

export {
  IPlaylistPayloadPost,
  PlayListItem
}
