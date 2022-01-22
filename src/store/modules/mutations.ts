import { MutationTree } from 'vuex'
import { ExampleStateInterface } from './state'
import { IAlbumFull } from '~/types/Album'

const mutations: MutationTree<ExampleStateInterface> = {
  setAlbum(state: ExampleStateInterface, data: IAlbumFull) {
    state.album = data
  }
}

export default mutations
