import api from '~/api'
import { SearchPayload, SearchResultState } from '~/types/Search'

export default class SearchServices {
  static async search(payload: SearchPayload) {
    const response = await api.post<SearchResultState[]>('/api/search', payload)

    if (response?.status === 200) {
      return response.data
    }

    throw new Error()
  }
}