import { IAlbumFull } from '~/types/Album'

export interface ExampleStateInterface {
  album: IAlbumFull | null
}

function state(): ExampleStateInterface {
  return {
    album: null
  }
}

export default state
