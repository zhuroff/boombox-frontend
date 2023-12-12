import api from '~/api'
import { DiscogsQueryConfig, DiscogsReleaseRow } from '~/types/Discogs'

export default {
  async getData(config: DiscogsQueryConfig) {
    const response = await api.post<DiscogsReleaseRow[]>(`/api/discogs`, config)

    if (response?.status === 200) {
      return response.data
    }

    throw new Error('Failed request')
  }
}