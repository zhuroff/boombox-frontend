import { AlbumPageRes } from '~/types/ReqRes'
import AlbumItem from './AlbumItem'
import AlbumTrack from './AlbumTrack'

export default class AlbumPage extends AlbumItem {
  tracks: AlbumTrack[]

  constructor(album: AlbumPageRes) {
    super(album)
    this.tracks = album.tracks.map((track, i) => (
      new AlbumTrack(track, i + 1, album.period, album.coverURL)
    ))
  }
}
