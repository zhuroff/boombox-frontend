import { GetterTree } from 'vuex'
import { ExampleStateInterface } from './state'
import { StateInterface } from '..'
import { AlbumHeadProps } from '~/types/Album'

const getters: GetterTree<ExampleStateInterface, StateInterface> = {
  albumIsLoaded: (state) => state.album.isLoaded,
  albumCover: (state) => state.album.albumCover,
  albumCoverArt: (state) => state.album.albumCoverArt,
  albumHead: (state): AlbumHeadProps => ({
    title: state.album.title,
    artist: state.album.artist,
    period: state.album.period,
    genre: state.album.genre,
    description: state.album.description
  })
}

export default getters
