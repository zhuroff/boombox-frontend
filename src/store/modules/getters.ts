import { GetterTree } from 'vuex'
import { ExampleStateInterface } from './state'
import { StateInterface } from '..'

const getters: GetterTree<ExampleStateInterface, StateInterface> = {
  albumIsLoaded: (state) => state.album !== null,
  albumCover: (state) => state.album?.albumCover,
  albumBookletID: (state) => state.album?.albumCoverArt
}

export default getters
