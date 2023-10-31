import api from '~/api'
import { DiscogsDetails, DiscogsQueryConfig, DiscogsReleaseRow } from '~/types/Discogs'

export default class DiscogsServices {
  static async discogs(config: DiscogsQueryConfig) {
    const response = await api.post<DiscogsReleaseRow[]>(`/api/discogs`, config)

    if (response?.status === 200) {
      return response.data
    }

    throw new Error('Failed request')
  }

  static async discogsDetails(id: number) {
    const response = await api.get<DiscogsDetails>(`/api/discogs/${id}`)
    
    if (response?.status === 200) {
      return response.data
    }

    throw new Error('Failed request')
  }
}
