import { api } from '~shared/api'
import type { SearchResultState, SearchPayload } from '~features/search'

export default class SearchService {
  search = async (payload: SearchPayload) => {
    const response = await api.post<SearchResultState[]>(`/api/search`, payload)
    return response.data
  }
}
