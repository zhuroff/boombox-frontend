import api from '~/app/api'
import type { DiscogsQueryConfig, DiscogsReleaseRow } from '../model/types'

export default class DiscogsService {
  getData = async (config: DiscogsQueryConfig) => {
    try {
      const response = await api.post<DiscogsReleaseRow[]>(`/api/discogs`, config)

      if (response?.status === 200) {
        return response.data
      }

      throw new Error('Failed request')
    } catch (error) {
      throw error
    }
  }
}
