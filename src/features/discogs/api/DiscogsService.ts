import { api } from '~shared/api'
import type { DiscogsQueryConfig, DiscogsReleaseRow } from '../lib/types'

export default class DiscogsService {
  getData = async (config: DiscogsQueryConfig) => {
    const response = await api.post<DiscogsReleaseRow[]>(`/api/discogs`, config)

    if (response?.status === 200) {
      return response.data
    }

    throw new Error('Failed request')
  }
}
