import { Track } from './Track'

type PlaylistPayload = {
  title: string
  track: string
}

type PlaylistTrackItem = {
  order: number
  track: string,
}

type PlayListItem = {
  _id: string
  title: string
  tracks: PlaylistTrackItem[]
}

type PlaylistPage = {
  _id: string
  title: string
  dateCreated: string
  tracks: Track[]
}

type PlaylistItemProps = {
  isFetched: boolean
  data: PlayListItem[] 
}

type PlaylistPageProps = {
  isFetched: boolean
  data: PlaylistPage
}

export {
  PlaylistPayload,
  PlayListItem,
  PlaylistPage,
  PlaylistItemProps,
  PlaylistPageProps
}
