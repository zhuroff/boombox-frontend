import type { TOYAlbumBasic } from '../lib/types'

export const isTOYAlbum = (album: { kind: string }): album is TOYAlbumBasic => {
  return 'metadataContent' in album && album.kind === 'album'
}