interface INewPlaylistPayloadTrack {
  _id: string
  track: string,
  order: number
}

interface IPlaylistBasic {
  _id: string
  title: string
  tracks: INewPlaylistPayloadTrack[]
}

export {
  INewPlaylistPayloadTrack,
  IPlaylistBasic
}
