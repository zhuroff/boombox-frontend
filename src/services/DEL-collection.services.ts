import { ResponseMessage, ReorderPayload } from '~/types/Common'
import api from '~/api'

export default {
  async addRemove(collections: any /* CollectionListItem[]*/, payload: any /* FloatModalCheckAction */) {
    const targetCollection = collections.find((collection: any) => (
        collection._id === payload.listID
      ))

    if (targetCollection) {
      payload.order = Math.max(...targetCollection.albums.map((album: any) => (
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
  },

  async create(title: string, album: string) {
    const response = await api.post<ResponseMessage>('/api/collections/create', { title, album })

    if (response?.status === 201) {
      return {
        message: response.data.message,
        type: 'success'
      }
    }

    throw new Error('Request failed')
  },

  async list(): Promise<any /* CollectionListItem[] */> {
    const response = await api.get<any /* CollectionListItem[] */>('/api/collections')

    if (response.status === 200) {
      return response.data
    }

    throw new Error('Request failed')
  },

  async single(id: string) {
    const response = await api.get<any /* CollectionPageItem*/>(`/api/collections/${id}`)
    
    if (response?.status === 200) {
      return response.data
    }

    throw new Error('Request failed')
  },

  async remove(id: string) {
    const response = await api.delete<ResponseMessage>(`/api/collections/${id}`)

    if (response?.status === 201) {
      return response.data.message
    }

    throw new Error('Request failed')
  },

  async reorder(payload: ReorderPayload) {
    const response = await api.patch<ResponseMessage>(`/api/collections/${payload.entityID}/reorder`, payload)

    if (response?.status === 201) {
      return response.data.message
    }

    throw new Error('Request failed')
  }
}