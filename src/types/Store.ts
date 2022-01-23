import { IAlbumFull } from '~/types/Album'

interface IState {}

interface IAlbumState {
  album: IAlbumFull
}

export {
  IState,
  IAlbumState
}
