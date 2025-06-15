import type { AlbumFull } from '../lib/types'

export const isRegularAlbum = (album: { kind: string }): album is AlbumFull => {
  return album.kind === 'album'
}
