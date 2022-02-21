import api from '~/api'
import { ICollectionBasic } from '~/types/Collection';
import { IFloatModalCheckAction } from '~/types/Global';

export default class CollectionServices {
  static async addRemove(collections: ICollectionBasic[], payload: IFloatModalCheckAction) {
    const targetCollection = collections.find((collection) => (
      collection._id === payload.listID
    ))

    if (targetCollection) {
      payload.order = Math.max(...targetCollection.albums.map((album) => (
        album.order
      ))) + 1

      const response = await api.patch(`/api/collections/${payload.listID}`, payload)

      if (response?.status === 201) {
        return {
          message: response.data.message,
          type: 'success'
        }
      }

      throw new Error('Request failed')
    }

    throw new Error('There is no such collection')
  }

  static async create(title: string, album: string) {
    const response = await api.post('/api/collections/create', { title, album })

    if (response?.status === 201) {
      return {
        message: response.data.message,
        type: 'success'
      }
    }

    throw new Error('Request failed')
  }

  static async list(): Promise<ICollectionBasic[]> {
    const response = await api.get('/api/collections')

    if (response.status === 200) {
      return response.data
    }

    throw new Error('Request failed')
  }
}