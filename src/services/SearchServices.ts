import api from '~/api'
import { SearchPayload } from '~/types/Search'

export default class SearchServices {
  static async search<T>(payload: SearchPayload): Promise<T[]> {
    const response = await api.post<T[]>('/api/search', payload)

    if (response?.status === 200) {
      return response.data
    }

    throw new Error()
  }
}