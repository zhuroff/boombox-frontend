import { AlbumTrackDTO } from '~/dto/AlbumTrackDTO'

export type PlaylistPayload = {
  title: string
  track: string
}

export type PlaylistTrackItem = {
  order: number
  track: string,
}

export type PlayListItem = {
  _id: string
  title: string
  tracks: PlaylistTrackItem[]
}

export type PlaylistPage = {
  _id: string
  title: string
  poster?: string
  avatar?: string
  dateCreated: string
  tracks: AlbumTrackDTO[]
}

export type PlaylistItemProps = {
  isFetched: boolean
  data: PlayListItem[] 
}

export type PlaylistPageProps = {
  isFetched: boolean
  data: PlaylistPage
}
