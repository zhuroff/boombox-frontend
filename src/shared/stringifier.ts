import { CategoryBasic } from '~/types/Category'

const artistName = (artist: CategoryBasic) => {
  if (artist) {
    return artist.title
  }

  return 'Untitled artist'
}

const albumName = (albumTitle: string) => {
  if (albumTitle) {
    return albumTitle
  }

  return 'Untitled album'
}

const periodName = (period: CategoryBasic | undefined) => {
  if (period?.title) {
    return period.title
  }

  return 'Unknown year'
}

const albumCover = (cover: string | undefined) => {
  if (cover) {
    return cover
  }

  return '/img/album.webp'
}

export {
  artistName,
  albumName,
  periodName,
  albumCover
}
