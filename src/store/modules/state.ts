import { IAlbumFull } from '~/types/Album'

export interface ExampleStateInterface {
  album: IAlbumFull
}

function state(): ExampleStateInterface {
  return {
    album: {
      _id: '',
      albumCover: '',
      title: '',
      artist: { _id: '', title: '' },
      genre: { _id: '', title: '' },
      period: { _id: '', title: '' },
      albumCoverArt: 0,
      description: '',
      tracks: [],
      isLoaded: false
    }
  }
}

export default state
