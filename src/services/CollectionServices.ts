import { CollectionListItem, CollectionPageItem } from '~/types/Collection';
import { IFloatModalCheckAction, ResponseMessage } from '~/types/Global';
import api from '~/api'

export default class CollectionServices {
  static async addRemove(collections: CollectionListItem[], payload: IFloatModalCheckAction) {
    const targetCollection = collections.find((collection) => (
        collection._id === payload.listID
      ))

    if (targetCollection) {
      payload.order = Math.max(...targetCollection.albums.map((album) => (
        album.order
      ))) + 1

      const response = await api.patch<ResponseMessage>(`/api/collections/${payload.listID}`, payload)

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
    const response = await api.post<ResponseMessage>('/api/collections/create', { title, album })

    if (response?.status === 201) {
      return {
        message: response.data.message,
        type: 'success'
      }
    }

    throw new Error('Request failed')
  }

  static async list(): Promise<CollectionListItem[]> {
    const response = await api.get<CollectionListItem[]>('/api/collections')

    if (response.status === 200) {
      return response.data
    }

    throw new Error('Request failed')
  }

  static async single(id: string) {
    const response = await api.get<CollectionPageItem>(`/api/collections/${id}`)
    
    if (response?.status === 200) {
      return response.data
    }

    throw new Error('Request failed')
  }

  static async remove(id: string) {
    const response = await api.delete<ResponseMessage>(`/api/collections/${id}`)

    if (response?.status === 201) {
      return response.data.message
    }

    throw new Error('Request failed')
  }
}