import { ICategoryBasic } from '~/types/Category'
import { IPlaylist } from '~/types/Player'

const artistName = (artist: ICategoryBasic, fileid?: number) => {
  if (artist) {
    return artist.title
  }

  // const targetTrack = playlist.tracks.find((el) => el.fileid === fileid)

  // if (targetTrack) return targetTrack.artist.title
  return 'Untitled artist'
}

const albumName = (album: IPlaylist, fileid?: number) => {
  if (album.title) {
    return album.title
  }

  // const targetTrack = playlist.tracks.find((el) => el.fileid === fileid)

  // if (targetTrack) return targetTrack.album.title
  return 'Untitled album'
}

const periodName = (period: ICategoryBasic, fileid?: number) => {
  if (period.title) {
    return period.title
  }

  // const targetTrack = playlist.tracks.find((el) => el.fileid === fileid)

  // if (targetTrack) return targetTrack.album.releaseYear
  return 'Unknown year'
}

const albumCover = (album: IPlaylist, fileid?: number) => {
  if (album.albumCover) {
    return album.albumCover
  }

  // const targetTrack = playlist.tracks.find((el) => el.fileid === fileid)

  // if (targetTrack) return targetTrack.album.albumCover
  return 'https://sverigesradio.se/dist/images/album-cover-placeholder-light.png'
}

export {
  artistName,
  albumName,
  periodName,
  albumCover
}
